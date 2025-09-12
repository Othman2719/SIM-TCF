import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 SUPABASE CONFIGURATION ERROR 🚨');
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing');
  console.error('');
  console.error('🔧 TO FIX THIS:');
  console.error('1. Check your .env file in the project root');
  console.error('2. Add your Supabase credentials:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  console.error('3. Get credentials from: https://supabase.com → Your Project → Settings → API');
  console.error('4. Restart the development server');
  console.error('');
}

// Check if values are still placeholders
if (supabaseUrl?.includes('your-project-id') || supabaseAnonKey?.includes('your-anon-key')) {
  console.warn('⚠️ Supabase using placeholder values - running in demo mode');
}

// Only log success if properly configured
if (supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') && 
    !supabaseAnonKey.includes('your-anon-key')) {
  console.log('✅ Supabase configured successfully:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length
  });
}

// Create client with fallback values to prevent crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'tcf-simulator'
    }
  }
});

// Export configuration status for use in components
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && 
           supabaseAnonKey && 
           !supabaseUrl.includes('your-project-id') && 
           !supabaseAnonKey.includes('your-anon-key'));
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          role: 'super_admin' | 'admin' | 'client';
          is_active: boolean;
          subscription_type: 'free' | 'premium' | 'enterprise';
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          full_name?: string;
          role?: 'super_admin' | 'admin' | 'client';
          is_active?: boolean;
          subscription_type?: 'free' | 'premium' | 'enterprise';
          subscription_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          role?: 'super_admin' | 'admin' | 'client';
          is_active?: boolean;
          subscription_type?: 'free' | 'premium' | 'enterprise';
          subscription_expires_at?: string | null;
          updated_at?: string;
        };
      };
      exam_sets: {
        Row: {
          id: number;
          name: string;
          description: string;
          is_active: boolean;
          is_premium: boolean;
          difficulty_level: string;
          time_limit_minutes: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string;
          is_active?: boolean;
          is_premium?: boolean;
          difficulty_level?: string;
          time_limit_minutes?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          is_active?: boolean;
          is_premium?: boolean;
          difficulty_level?: string;
          time_limit_minutes?: number;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          exam_set_id: number;
          section: 'listening' | 'grammar' | 'reading';
          question_text: string;
          options: string[];
          correct_answer: number;
          level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          audio_url: string | null;
          image_url: string | null;
          explanation: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_set_id: number;
          section: 'listening' | 'grammar' | 'reading';
          question_text: string;
          options: string[];
          correct_answer: number;
          level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          audio_url?: string | null;
          image_url?: string | null;
          explanation?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_set_id?: number;
          section?: 'listening' | 'grammar' | 'reading';
          question_text?: string;
          options?: string[];
          correct_answer?: number;
          level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
          audio_url?: string | null;
          image_url?: string | null;
          explanation?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
      };
      test_sessions: {
        Row: {
          id: string;
          user_id: string;
          exam_set_id: number;
          status: 'in_progress' | 'completed' | 'abandoned';
          started_at: string;
          completed_at: string | null;
          time_remaining: number;
          current_section: string;
          current_question_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_set_id: number;
          status?: 'in_progress' | 'completed' | 'abandoned';
          started_at?: string;
          completed_at?: string | null;
          time_remaining?: number;
          current_section?: string;
          current_question_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_set_id?: number;
          status?: 'in_progress' | 'completed' | 'abandoned';
          started_at?: string;
          completed_at?: string | null;
          time_remaining?: number;
          current_section?: string;
          current_question_index?: number;
          updated_at?: string;
        };
      };
      test_answers: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          selected_answer: number;
          is_correct: boolean;
          answered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          selected_answer: number;
          is_correct?: boolean;
          answered_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          question_id?: string;
          selected_answer?: number;
          is_correct?: boolean;
          answered_at?: string;
        };
      };
      test_results: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          exam_set_id: number;
          total_score: number;
          tcf_level: string;
          listening_score: number;
          grammar_score: number;
          reading_score: number;
          correct_answers: number;
          total_questions: number;
          completion_time_minutes: number;
          certificate_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          exam_set_id: number;
          total_score?: number;
          tcf_level?: string;
          listening_score?: number;
          grammar_score?: number;
          reading_score?: number;
          correct_answers?: number;
          total_questions?: number;
          completion_time_minutes?: number;
          certificate_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          exam_set_id?: number;
          total_score?: number;
          tcf_level?: string;
          listening_score?: number;
          grammar_score?: number;
          reading_score?: number;
          correct_answers?: number;
          total_questions?: number;
          completion_time_minutes?: number;
          certificate_number?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          result_id: string;
          user_id: string;
          certificate_number: string;
          issued_at: string;
          pdf_url: string | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          result_id: string;
          user_id: string;
          certificate_number: string;
          issued_at?: string;
          pdf_url?: string | null;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          result_id?: string;
          user_id?: string;
          certificate_number?: string;
          issued_at?: string;
          pdf_url?: string | null;
          is_verified?: boolean;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          subscription_type: 'free' | 'premium' | 'enterprise';
          starts_at: string;
          expires_at: string | null;
          is_active: boolean;
          payment_status: 'pending' | 'paid' | 'failed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_type: 'free' | 'premium' | 'enterprise';
          starts_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_type?: 'free' | 'premium' | 'enterprise';
          starts_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          event_data: Record<string, any>;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          event_data?: Record<string, any>;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          event_data?: Record<string, any>;
          session_id?: string | null;
        };
      };
    };
  };
}