import { Question } from '../contexts/TestContext';

export const mockQuestions: Question[] = [
  // Listening Questions
  {
    id: 'listening_1',
    section: 'listening',
    examSet: 1,
    questionText: 'Écoutez le dialogue et répondez: Où se déroule cette conversation?',
    options: [
      'Dans un restaurant',
      'Dans une pharmacie',
      'Dans un magasin de vêtements',
      'Dans une banque'
    ],
    correctAnswer: 0,
    level: 'A1',
  },
  {
    id: 'listening_2',
    section: 'listening',
    examSet: 1,
    questionText: 'Selon l\'enregistrement, quelle est l\'heure du rendez-vous?',
    options: [
      '14h30',
      '15h00',
      '15h30',
      '16h00'
    ],
    correctAnswer: 2,
    level: 'A2',
  },
  {
    id: 'listening_3',
    section: 'listening',
    examSet: 1,
    questionText: 'Quel est le problème principal évoqué dans ce reportage?',
    options: [
      'La pollution de l\'air',
      'Le manque de transports publics',
      'Les embouteillages en ville',
      'Le prix de l\'essence'
    ],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'listening_4',
    section: 'listening',
    examSet: 1,
    questionText: 'Quelle est l\'opinion de l\'interviewé sur cette question?',
    options: [
      'Il est complètement d\'accord',
      'Il est plutôt d\'accord',
      'Il est en désaccord',
      'Il n\'a pas d\'opinion'
    ],
    correctAnswer: 1,
    level: 'B2'
  },
  {
    id: 'listening_5',
    section: 'listening',
    examSet: 1,
    questionText: 'Selon l\'expert, quelle sera l\'évolution probable dans les prochaines années?',
    options: [
      'Une amélioration significative',
      'Une stagnation de la situation',
      'Une dégradation progressive',
      'Des changements imprévisibles'
    ],
    correctAnswer: 0,
    level: 'C1'
  },

  // Grammar Questions
  {
    id: 'grammar_1',
    section: 'grammar',
    examSet: 1,
    questionText: 'Complétez: "Je _____ au cinéma hier soir."',
    options: [
      'vais',
      'suis allé',
      'irai',
      'allais'
    ],
    correctAnswer: 1,
    level: 'A1'
  },
  {
    id: 'grammar_2',
    section: 'grammar',
    examSet: 1,
    questionText: 'Choisissez la forme correcte: "Les livres que j\'ai _____"',
    options: [
      'lu',
      'lus',
      'lue',
      'lues'
    ],
    correctAnswer: 1,
    level: 'A2'
  },
  {
    id: 'grammar_3',
    section: 'grammar',
    examSet: 1,
    questionText: 'Quel est le subjonctif de "avoir" à la 3ème personne du singulier?',
    options: [
      'qu\'il a',
      'qu\'il ait',
      'qu\'il aura',
      'qu\'il avait'
    ],
    correctAnswer: 1,
    level: 'B1'
  },
  {
    id: 'grammar_4',
    section: 'grammar',
    examSet: 1,
    questionText: 'Complétez: "_____ il pleuve, nous sortirons."',
    options: [
      'Malgré que',
      'Bien que',
      'Pendant que',
      'Afin que'
    ],
    correctAnswer: 1,
    level: 'B2'
  },
  {
    id: 'grammar_5',
    section: 'grammar',
    examSet: 1,
    questionText: 'Transformez au discours indirect: Il m\'a dit: "Je partirai demain."',
    options: [
      'Il m\'a dit qu\'il partirait le lendemain',
      'Il m\'a dit qu\'il partira demain',
      'Il m\'a dit qu\'il est parti le lendemain',
      'Il m\'a dit qu\'il part demain'
    ],
    correctAnswer: 0,
    level: 'C1'
  },

  // Reading Questions
  {
    id: 'reading_1',
    section: 'reading',
    examSet: 1,
    questionText: 'Lisez ce panneau: "Défense d\'afficher". Que signifie-t-il?',
    options: [
      'Il est interdit de coller des affiches',
      'Il faut afficher ici',
      'Les affiches sont protégées',
      'On peut afficher avec autorisation'
    ],
    correctAnswer: 0,
    level: 'A1'
  },
  {
    id: 'reading_2',
    section: 'reading',
    examSet: 1,
    questionText: 'D\'après cette annonce, quand a lieu l\'événement?',
    options: [
      'Le matin',
      'L\'après-midi',
      'Le soir',
      'Toute la journée'
    ],
    correctAnswer: 2,
    level: 'A2'
  },
  {
    id: 'reading_3',
    section: 'reading',
    examSet: 1,
    questionText: 'Quel est l\'objectif principal de cet article?',
    options: [
      'Informer sur un problème',
      'Convaincre le lecteur',
      'Divertir le public',
      'Présenter des statistiques'
    ],
    correctAnswer: 0,
    level: 'B1'
  },
  {
    id: 'reading_4',
    section: 'reading',
    examSet: 1,
    questionText: 'Quelle est la position de l\'auteur dans ce débat?',
    options: [
      'Il reste neutre',
      'Il défend une position claire',
      'Il présente tous les points de vue',
      'Il critique toutes les opinions'
    ],
    correctAnswer: 1,
    level: 'B2'
  },
  {
    id: 'reading_5',
    section: 'reading',
    examSet: 1,
    questionText: 'Les nuances stylistiques de ce texte révèlent:',
    options: [
      'Un registre familier',
      'Un style soutenu',
      'Un ton ironique',
      'Une approche didactique'
    ],
    correctAnswer: 2,
    level: 'C1'
  },
];