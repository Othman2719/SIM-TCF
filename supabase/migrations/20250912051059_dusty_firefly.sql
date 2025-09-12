/*
  # Initial TCF System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) 
      - `email` (text, unique)
      - `username` (text, unique)
      - `full_name` (text)
      - `role` (enum: admin, client)
      - `is_active` (boolean)
      - `subscription_type` (enum: free, premium, enterprise)
      - `subscription_expires_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `exam_sets`
      - `id` (integer, primary key)
      - `name` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `is_premium` (boolean)
      - `difficulty_level` (text)
      - `time_limit_minutes` (integer)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `questions`
      - `id` (uuid, primary key)
      - `exam_set_id` (integer, foreign key)
      - `section` (enum: listening, grammar, reading)
      - `question_text` (text)
      - `options` (jsonb array)
      - `correct_answer` (integer)
      - `level` (enum: A1, A2, B1, B2, C1, C2)
      - `audio_url` (text, optional)
      - `image_url` (text, optional)
      - `explanation` (text, optional)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `test_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `exam_set_id` (integer, foreign key)
      - `status` (enum: in_progress, completed, abandoned)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `time_remaining` (integer)
      - `current_section` (text)
      - `current_question_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `test_answers`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `question_id` (uuid, foreign key)
      - `selected_answer` (integer)
      - `is_correct` (boolean)
      - `answered_at` (timestamp)
      - `created_at` (timestamp)

    - `test_results`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `exam_set_id` (integer, foreign key)
      - `total_score` (integer)
      - `tcf_level` (text)
      - `listening_score` (integer)
      - `grammar_score` (integer)
      - `reading_score` (integer)
      - `correct_answers` (integer)
      - `total_questions` (integer)
      - `completion_time_minutes` (integer)
      - `certificate_number` (text, unique)
      - `created_at` (timestamp)

    - `certificates`
      - `id` (uuid, primary key)
      - `result_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `certificate_number` (text, unique)
      - `issued_at` (timestamp)
      - `pdf_url` (text, optional)
      - `is_verified` (boolean)
      - `created_at` (timestamp)

    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subscription_type` (enum: free, premium, enterprise)
      - `starts_at` (timestamp)
      - `expires_at` (timestamp)
      - `is_active` (boolean)
      - `payment_status` (enum: pending, paid, failed, cancelled)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `event_type` (text)
      - `event_data` (jsonb)
      - `session_id` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for admin management
    - Add policies for public exam access

  3. Indexes
    - Performance indexes on frequently queried columns
    - Unique constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'client');
CREATE TYPE subscription_type AS ENUM ('free', 'premium', 'enterprise');
CREATE TYPE question_section AS ENUM ('listening', 'grammar', 'reading');
CREATE TYPE tcf_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');

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

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Exam sets policies
CREATE POLICY "Everyone can read active exam sets" ON exam_sets
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage exam sets" ON exam_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Questions policies
CREATE POLICY "Everyone can read questions from active exam sets" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exam_sets 
      WHERE id = questions.exam_set_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test sessions policies
CREATE POLICY "Users can manage own test sessions" ON test_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all test sessions" ON test_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test answers policies
CREATE POLICY "Users can manage own test answers" ON test_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM test_sessions 
      WHERE id = test_answers.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all test answers" ON test_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test results policies
CREATE POLICY "Users can read own test results" ON test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all test results" ON test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert test results" ON test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates policies
CREATE POLICY "Users can read own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all certificates" ON certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can read own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON user_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Analytics policies
CREATE POLICY "System can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics" ON analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
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

-- Insert default admin user (will be created via Supabase Auth)
-- This is just for reference - actual user creation happens through auth

-- Insert default exam sets
INSERT INTO exam_sets (id, name, description, is_active, is_premium, difficulty_level, time_limit_minutes) VALUES
(1, 'TCF - Examen Principal', 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux', true, false, 'mixed', 90),
(2, 'TCF - Examen Premium', 'Examen avancé avec questions de niveau supérieur', true, true, 'advanced', 120),
(3, 'TCF - Examen Débutant', 'Examen spécialement conçu pour les débutants (A1-A2)', true, false, 'beginner', 60),
(4, 'TCF - Examen Expert', 'Examen pour les niveaux avancés (B2-C2)', true, true, 'expert', 150);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_sets_updated_at BEFORE UPDATE ON exam_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_sessions_updated_at BEFORE UPDATE ON test_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();