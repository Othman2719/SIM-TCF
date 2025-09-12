/*
  # Sample Data for TCF Simulator

  1. Sample Data
    - Default exam sets
    - Sample questions for testing
    - Admin user setup

  2. Initial Configuration
    - Enable realtime for tables
    - Set up default exam structure
*/

-- Insert default exam sets
INSERT INTO exam_sets (id, name, description, is_active, is_premium, difficulty_level, time_limit_minutes) VALUES
(1, 'TCF - Examen Principal', 'Examen principal du Test de Connaissance du Français avec questions de tous niveaux', true, false, 'mixed', 90),
(2, 'TCF - Examen 2', 'Deuxième examen du Test de Connaissance du Français', false, false, 'intermediate', 90),
(3, 'TCF - Examen 3', 'Troisième examen du Test de Connaissance du Français', false, false, 'advanced', 90),
(4, 'TCF - Examen 4', 'Quatrième examen du Test de Connaissance du Français', false, true, 'expert', 90)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for exam_sets
SELECT setval('exam_sets_id_seq', (SELECT MAX(id) FROM exam_sets));

-- Insert sample questions for Exam 1 (Listening)
INSERT INTO questions (id, exam_set_id, section, question_text, options, correct_answer, level, audio_url) VALUES
('listening_1', 1, 'listening', 'Écoutez le dialogue et répondez: Où se déroule cette conversation?', '["Dans un restaurant", "Dans une pharmacie", "Dans un magasin de vêtements", "Dans une banque"]', 0, 'A1', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'),
('listening_2', 1, 'listening', 'Selon l''enregistrement, quelle est l''heure du rendez-vous?', '["14h30", "15h00", "15h30", "16h00"]', 2, 'A2', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'),
('listening_3', 1, 'listening', 'Quel est le problème principal évoqué dans ce reportage?', '["La pollution de l''air", "Le manque de transports publics", "Les embouteillages en ville", "Le prix de l''essence"]', 0, 'B1', null),
('listening_4', 1, 'listening', 'Quelle est l''opinion de l''interviewé sur cette question?', '["Il est complètement d''accord", "Il est plutôt d''accord", "Il est en désaccord", "Il n''a pas d''opinion"]', 1, 'B2', null),
('listening_5', 1, 'listening', 'Selon l''expert, quelle sera l''évolution probable dans les prochaines années?', '["Une amélioration significative", "Une stagnation de la situation", "Une dégradation progressive", "Des changements imprévisibles"]', 0, 'C1', null)
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for Exam 1 (Grammar)
INSERT INTO questions (id, exam_set_id, section, question_text, options, correct_answer, level) VALUES
('grammar_1', 1, 'grammar', 'Complétez: "Je _____ au cinéma hier soir."', '["vais", "suis allé", "irai", "allais"]', 1, 'A1'),
('grammar_2', 1, 'grammar', 'Choisissez la forme correcte: "Les livres que j''ai _____"', '["lu", "lus", "lue", "lues"]', 1, 'A2'),
('grammar_3', 1, 'grammar', 'Quel est le subjonctif de "avoir" à la 3ème personne du singulier?', '["qu''il a", "qu''il ait", "qu''il aura", "qu''il avait"]', 1, 'B1'),
('grammar_4', 1, 'grammar', 'Complétez: "_____ il pleuve, nous sortirons."', '["Malgré que", "Bien que", "Pendant que", "Afin que"]', 1, 'B2'),
('grammar_5', 1, 'grammar', 'Transformez au discours indirect: Il m''a dit: "Je partirai demain."', '["Il m''a dit qu''il partirait le lendemain", "Il m''a dit qu''il partira demain", "Il m''a dit qu''il est parti le lendemain", "Il m''a dit qu''il part demain"]', 0, 'C1')
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for Exam 1 (Reading)
INSERT INTO questions (id, exam_set_id, section, question_text, options, correct_answer, level) VALUES
('reading_1', 1, 'reading', 'Lisez ce panneau: "Défense d''afficher". Que signifie-t-il?', '["Il est interdit de coller des affiches", "Il faut afficher ici", "Les affiches sont protégées", "On peut afficher avec autorisation"]', 0, 'A1'),
('reading_2', 1, 'reading', 'D''après cette annonce, quand a lieu l''événement?', '["Le matin", "L''après-midi", "Le soir", "Toute la journée"]', 2, 'A2'),
('reading_3', 1, 'reading', 'Quel est l''objectif principal de cet article?', '["Informer sur un problème", "Convaincre le lecteur", "Divertir le public", "Présenter des statistiques"]', 0, 'B1'),
('reading_4', 1, 'reading', 'Quelle est la position de l''auteur dans ce débat?', '["Il reste neutre", "Il défend une position claire", "Il présente tous les points de vue", "Il critique toutes les opinions"]', 1, 'B2'),
('reading_5', 1, 'reading', 'Les nuances stylistiques de ce texte révèlent:', '["Un registre familier", "Un style soutenu", "Un ton ironique", "Une approche didactique"]', 2, 'C1')
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for Exam 2
INSERT INTO questions (id, exam_set_id, section, question_text, options, correct_answer, level) VALUES
('listening_2_1', 2, 'listening', 'Dans cet enregistrement, que demande la personne?', '["Des informations sur les horaires", "Le prix d''un billet", "La direction à suivre", "L''heure actuelle"]', 2, 'A1'),
('listening_2_2', 2, 'listening', 'Quelle est la météo annoncée pour demain?', '["Ensoleillé", "Pluvieux", "Nuageux", "Orageux"]', 1, 'A2'),
('listening_2_3', 2, 'listening', 'Selon le journaliste, quel est le principal défi?', '["Le financement du projet", "L''acceptation du public", "Les contraintes techniques", "Les délais de réalisation"]', 0, 'B1'),
('grammar_2_1', 2, 'grammar', 'Complétez: "Elle _____ ses devoirs avant de sortir."', '["finit", "a fini", "finira", "finissait"]', 1, 'A1'),
('grammar_2_2', 2, 'grammar', 'Choisissez la bonne préposition: "Il habite _____ Paris."', '["dans", "à", "en", "sur"]', 1, 'A2'),
('reading_2_1', 2, 'reading', 'Ce texte est principalement:', '["Une publicité", "Un mode d''emploi", "Un article de journal", "Une lettre personnelle"]', 2, 'A1'),
('reading_2_2', 2, 'reading', 'L''auteur exprime:', '["Son inquiétude", "Sa satisfaction", "Son indifférence", "Sa colère"]', 0, 'B1')
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for Exam 3
INSERT INTO questions (id, exam_set_id, section, question_text, options, correct_answer, level) VALUES
('listening_3_1', 3, 'listening', 'Le rendez-vous est fixé à:', '["9h00", "9h30", "10h00", "10h30"]', 1, 'A1'),
('listening_3_2', 3, 'listening', 'La personne exprime:', '["Sa joie", "Sa déception", "Sa surprise", "Sa peur"]', 2, 'A2'),
('grammar_3_1', 3, 'grammar', 'Accordez correctement: "Les fleurs que j''ai _____"', '["acheté", "achetés", "achetée", "achetées"]', 3, 'A2'),
('grammar_3_2', 3, 'grammar', 'Conjuguez au subjonctif: "Il faut que tu _____"', '["viens", "viennes", "viendras", "venais"]', 1, 'B1'),
('reading_3_1', 3, 'reading', 'Le ton de ce passage est:', '["Humoristique", "Dramatique", "Informatif", "Poétique"]', 2, 'A2'),
('reading_3_2', 3, 'reading', 'L''idée principale du texte est:', '["La protection de l''environnement", "Le développement économique", "L''éducation des jeunes", "La santé publique"]', 0, 'B1')
ON CONFLICT (id) DO NOTHING;