/*
  # Sample Data for TCF Simulator

  1. Sample Data
    - Create sample exam sets
    - Create sample questions for testing
    - Create sample admin user

  Note: This is for development/testing purposes
*/

-- Insert sample exam sets
INSERT INTO exam_sets (name, description, is_active, difficulty_level, time_limit_minutes) VALUES
('TCF - Examen Principal', 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux', true, 'mixed', 90),
('TCF - Examen Pratique', 'Examen de pratique pour se familiariser avec le format TCF', true, 'beginner', 60),
('TCF - Examen Avancé', 'Examen pour les niveaux avancés B2-C2', false, 'advanced', 120);

-- Note: Sample questions and users should be created through the application interface
-- This ensures proper authentication and relationship setup