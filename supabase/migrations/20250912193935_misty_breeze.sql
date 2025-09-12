/*
  # Initial Database Schema for TCF Simulator

  1. New Tables
    - `users` - User accounts with roles and subscriptions
    - `exam_sets` - Test collections/exams
    - `questions` - Individual questions with multimedia support
    - `test_sessions` - User test sessions tracking
    - `test_answers` - Individual question answers
    - `test_results` - Final test results and scores
    - `certificates` - Generated certificates
    - `user_subscriptions` - Subscription management
    - `analytics` - Usage tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure data access per user

  3. Features
    - Real-time subscriptions enabled
    - Automatic timestamps
    - UUID primary keys
    - Foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'client', 'super_admin');
CREATE TYPE subscription_type AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE question_section AS ENUM ('listening', 'grammar', 'reading');
CREATE TYPE tcf_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    username text UNIQUE NOT NULL,
    full_name text NOT NULL DEFAULT '',
    role user_role NOT NULL DEFAULT 'client',
    is_active boolean NOT NULL DEFAULT true,
    subscription_type subscription_type NOT NULL DEFAULT 'free',
    subscription_expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Exam sets table
CREATE TABLE IF NOT EXISTS exam_sets (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    is_active boolean NOT NULL DEFAULT true,
    is_premium boolean NOT NULL DEFAULT false,
    difficulty_level text NOT NULL DEFAULT 'mixed',
    time_limit_minutes integer NOT NULL DEFAULT 90,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_set_id integer REFERENCES exam_sets(id) ON DELETE CASCADE,
    section question_section NOT NULL,
    question_text text NOT NULL,
    options jsonb NOT NULL,
    correct_answer integer NOT NULL,
    level tcf_level NOT NULL DEFAULT 'A1',
    audio_url text,
    image_url text,
    explanation text,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Test sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    exam_set_id integer REFERENCES exam_sets(id) ON DELETE CASCADE,
    status session_status NOT NULL DEFAULT 'in_progress',
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    time_remaining integer NOT NULL DEFAULT 5400, -- 90 minutes in seconds
    current_section text NOT NULL DEFAULT 'listening',
    current_question_index integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Test answers table
CREATE TABLE IF NOT EXISTS test_answers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id uuid REFERENCES test_sessions(id) ON DELETE CASCADE,
    question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
    selected_answer integer NOT NULL,
    is_correct boolean NOT NULL DEFAULT false,
    answered_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    UNIQUE(session_id, question_id)
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id uuid REFERENCES test_sessions(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    exam_set_id integer REFERENCES exam_sets(id) ON DELETE CASCADE,
    total_score integer NOT NULL DEFAULT 0,
    tcf_level text NOT NULL DEFAULT 'A1',
    listening_score integer NOT NULL DEFAULT 0,
    grammar_score integer NOT NULL DEFAULT 0,
    reading_score integer NOT NULL DEFAULT 0,
    correct_answers integer NOT NULL DEFAULT 0,
    total_questions integer NOT NULL DEFAULT 0,
    completion_time_minutes integer NOT NULL DEFAULT 0,
    certificate_number text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id uuid REFERENCES test_results(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    certificate_number text UNIQUE NOT NULL,
    issued_at timestamptz DEFAULT now(),
    pdf_url text,
    is_verified boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    subscription_type subscription_type NOT NULL,
    starts_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    is_active boolean NOT NULL DEFAULT true,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}',
    session_id text,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_exam_sets_active ON exam_sets(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_exam_set ON questions(exam_set_id);
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_answers_session ON test_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_sets_updated_at BEFORE UPDATE ON exam_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_sessions_updated_at BEFORE UPDATE ON test_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Service role full access" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- RLS Policies for exam_sets table
CREATE POLICY "Everyone can read active exam sets" ON exam_sets FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Super admin can manage exam sets" ON exam_sets FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')));
CREATE POLICY "Service role can manage exam sets" ON exam_sets FOR ALL TO service_role USING (true);

-- RLS Policies for questions table
CREATE POLICY "Everyone can read questions from active exam sets" ON questions FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM exam_sets WHERE exam_sets.id = questions.exam_set_id AND exam_sets.is_active = true));
CREATE POLICY "Super admin can manage questions" ON questions FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')));
CREATE POLICY "Service role can manage questions" ON questions FOR ALL TO service_role USING (true);

-- RLS Policies for test_sessions table
CREATE POLICY "Users can manage own test sessions" ON test_sessions FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for test_answers table
CREATE POLICY "Users can manage own test answers" ON test_answers FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM test_sessions WHERE test_sessions.id = test_answers.session_id AND test_sessions.user_id = auth.uid()));

-- RLS Policies for test_results table
CREATE POLICY "Users can read own test results" ON test_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own test results" ON test_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for certificates table
CREATE POLICY "Users can read own certificates" ON certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certificates" ON certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_subscriptions table
CREATE POLICY "Users can read own subscriptions" ON user_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON user_subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics table
CREATE POLICY "System can insert analytics" ON analytics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service role can read analytics" ON analytics FOR SELECT TO service_role USING (true);