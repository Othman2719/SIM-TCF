import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'client';
  is_active: boolean;
  subscription_type: 'free' | 'premium' | 'enterprise';
  subscription_expires_at: string | null;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // User profile doesn't exist yet
          console.log('User profile not found, user needs to complete registration');
          setUser(null);
        } else {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    username: string;
    full_name: string;
    role?: 'admin' | 'client';
  }) => {
    try {
      setLoading(true);
      
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role || 'client',
          });

        if (profileError) throw profileError;

        // Create default subscription - only if user profile was created successfully
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: authData.user.id,
            subscription_type: 'free',
            is_active: true,
          });

        // Don't throw error for subscription creation failure, just log it
        if (subscriptionError) {
          console.warn('Failed to create default subscription:', subscriptionError);
        }
      }

      return { success: true, data: authData };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting sign in process...', { email });
      
      // Direct authentication attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Auth response:', { data: !!data, error: error?.message });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      setLoading(false); // Ensure loading is reset on error
      let errorMessage = 'Erreur de connexion';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email non confirmé';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      // Don't set loading false here, let the auth state change handle it
      console.log('Sign in process completed');
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}