import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string
          role: 'admin' | 'client' | 'super_admin'
          is_active: boolean
          subscription_type: 'free' | 'premium' | 'enterprise'
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          full_name?: string
          role?: 'admin' | 'client' | 'super_admin'
          is_active?: boolean
          subscription_type?: 'free' | 'premium' | 'enterprise'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string
          role?: 'admin' | 'client' | 'super_admin'
          is_active?: boolean
          subscription_type?: 'free' | 'premium' | 'enterprise'
          subscription_expires_at?: string | null
          updated_at?: string
        }
      }
      exam_sets: {
        Row: {
          id: number
          name: string
          description: string
          is_active: boolean
          is_premium: boolean
          difficulty_level: string
          time_limit_minutes: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string
          is_active?: boolean
          is_premium?: boolean
          difficulty_level?: string
          time_limit_minutes?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          is_active?: boolean
          is_premium?: boolean
          difficulty_level?: string
          time_limit_minutes?: number
          created_by?: string | null
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          exam_set_id: number | null
          section: 'listening' | 'grammar' | 'reading'
          question_text: string
          options: string[]
          correct_answer: number
          level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
          audio_url: string | null
          image_url: string | null
          explanation: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_set_id?: number | null
          section: 'listening' | 'grammar' | 'reading'
          question_text: string
          options: string[]
          correct_answer: number
          level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
          audio_url?: string | null
          image_url?: string | null
          explanation?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_set_id?: number | null
          section?: 'listening' | 'grammar' | 'reading'
          question_text?: string
          options?: string[]
          correct_answer?: number
          level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
          audio_url?: string | null
          image_url?: string | null
          explanation?: string | null
          created_by?: string | null
          updated_at?: string
        }
      }
      test_sessions: {
        Row: {
          id: string
          user_id: string | null
          exam_set_id: number | null
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          time_remaining: number
          current_section: string
          current_question_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          exam_set_id?: number | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          time_remaining?: number
          current_section?: string
          current_question_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          exam_set_id?: number | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          time_remaining?: number
          current_section?: string
          current_question_index?: number
          updated_at?: string
        }
      }
      test_answers: {
        Row: {
          id: string
          session_id: string | null
          question_id: string | null
          selected_answer: number
          is_correct: boolean
          answered_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          question_id?: string | null
          selected_answer: number
          is_correct?: boolean
          answered_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          question_id?: string | null
          selected_answer?: number
          is_correct?: boolean
          answered_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          session_id: string | null
          user_id: string | null
          exam_set_id: number | null
          total_score: number
          tcf_level: string
          listening_score: number
          grammar_score: number
          reading_score: number
          correct_answers: number
          total_questions: number
          completion_time_minutes: number
          certificate_number: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          user_id?: string | null
          exam_set_id?: number | null
          total_score?: number
          tcf_level?: string
          listening_score?: number
          grammar_score?: number
          reading_score?: number
          correct_answers?: number
          total_questions?: number
          completion_time_minutes?: number
          certificate_number: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          user_id?: string | null
          exam_set_id?: number | null
          total_score?: number
          tcf_level?: string
          listening_score?: number
          grammar_score?: number
          reading_score?: number
          correct_answers?: number
          total_questions?: number
          completion_time_minutes?: number
          certificate_number?: string
        }
      }
    }
  }
}