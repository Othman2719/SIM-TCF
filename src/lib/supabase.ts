import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Present' : 'Missing',
    key: supabaseAnonKey ? 'Present' : 'Missing'
  });
  console.warn('⚠️  Supabase not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.warn('📖 See README.md for setup instructions');
}

console.log('Supabase configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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