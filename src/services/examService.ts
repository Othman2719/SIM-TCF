import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type ExamSet = Database['public']['Tables']['exam_sets']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type TestSession = Database['public']['Tables']['test_sessions']['Row'];
type TestAnswer = Database['public']['Tables']['test_answers']['Row'];
type TestResult = Database['public']['Tables']['test_results']['Row'];

export class ExamService {
  // Exam Sets
  static async getExamSets(includeInactive = false) {
    const query = supabase
      .from('exam_sets')
      .select('*')
      .order('id');

    if (!includeInactive) {
      query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createExamSet(examSet: Database['public']['Tables']['exam_sets']['Insert']) {
    const { data, error } = await supabase
      .from('exam_sets')
      .insert(examSet)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExamSet(id: number, updates: Database['public']['Tables']['exam_sets']['Update']) {
    const { data, error } = await supabase
      .from('exam_sets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteExamSet(id: number) {
    const { error } = await supabase
      .from('exam_sets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Questions
  static async getQuestions(examSetId?: number, section?: string) {
    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at');

    if (examSetId) {
      query = query.eq('exam_set_id', examSetId);
    }

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createQuestion(question: Database['public']['Tables']['questions']['Insert']) {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateQuestion(id: string, updates: Database['public']['Tables']['questions']['Update']) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Test Sessions
  static async createTestSession(session: Database['public']['Tables']['test_sessions']['Insert']) {
    const { data, error } = await supabase
      .from('test_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTestSession(id: string, updates: Database['public']['Tables']['test_sessions']['Update']) {
    const { data, error } = await supabase
      .from('test_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTestSession(id: string) {
    const { data, error } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserTestSessions(userId: string) {
    const { data, error } = await supabase
      .from('test_sessions')
      .select(`
        *,
        exam_sets (name, description),
        test_results (total_score, tcf_level, certificate_number)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Test Answers
  static async saveTestAnswer(answer: Database['public']['Tables']['test_answers']['Insert']) {
    const { data, error } = await supabase
      .from('test_answers')
      .upsert(answer, { onConflict: 'session_id,question_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTestAnswers(sessionId: string) {
    const { data, error } = await supabase
      .from('test_answers')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;
    return data;
  }

  // Test Results
  static async createTestResult(result: Database['public']['Tables']['test_results']['Insert']) {
    const { data, error } = await supabase
      .from('test_results')
      .insert(result)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserTestResults(userId: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        exam_sets (name, description),
        certificates (certificate_number, issued_at, is_verified)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getTestResult(id: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        exam_sets (name, description),
        certificates (certificate_number, issued_at, is_verified)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics
  static async trackEvent(event: {
    user_id?: string;
    event_type: string;
    event_data?: Record<string, any>;
    session_id?: string;
  }) {
    const { error } = await supabase
      .from('analytics')
      .insert(event);

    if (error) console.error('Analytics tracking error:', error);
  }

  // Admin Analytics
  static async getAnalytics(startDate?: string, endDate?: string) {
    let query = supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getDashboardStats() {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('event_type', 'test_started');

    // Get total tests completed
    const { count: testsCompleted } = await supabase
      .from('test_results')
      .select('*', { count: 'exact', head: true });

    // Get premium subscriptions
    const { count: premiumUsers } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .in('subscription_type', ['premium', 'enterprise']);

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      testsCompleted: testsCompleted || 0,
      premiumUsers: premiumUsers || 0,
    };
  }
}