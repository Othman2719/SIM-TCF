// WordPress REST API client for TCF Simulator
export interface WordPressConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  applicationPassword?: string;
}

class WordPressAPI {
  private baseUrl: string;
  private auth?: string;

  constructor(config: WordPressConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    
    if (config.username && config.applicationPassword) {
      this.auth = btoa(`${config.username}:${config.applicationPassword}`);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.auth) {
      headers.Authorization = `Basic ${this.auth}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    roles: string[];
    meta?: Record<string, any>;
  }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: number, userData: Partial<any>) {
    return this.request(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Custom Post Types - Exam Sets
  async getExamSets() {
    return this.request('/exam-sets');
  }

  async createExamSet(examData: {
    title: string;
    content: string;
    status: 'publish' | 'draft';
    meta: {
      description: string;
      is_active: boolean;
      is_premium: boolean;
      time_limit_minutes: number;
    };
  }) {
    return this.request('/exam-sets', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  // Custom Post Types - Questions
  async getQuestions(examSetId?: number) {
    const endpoint = examSetId ? `/questions?exam_set=${examSetId}` : '/questions';
    return this.request(endpoint);
  }

  async createQuestion(questionData: {
    title: string;
    content: string;
    status: 'publish' | 'draft';
    meta: {
      exam_set_id: number;
      section: 'listening' | 'grammar' | 'reading';
      question_text: string;
      options: string[];
      correct_answer: number;
      level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
      audio_url?: string;
      image_url?: string;
    };
  }) {
    return this.request('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  // Test Sessions
  async createTestSession(sessionData: {
    title: string;
    status: 'publish';
    meta: {
      user_id: number;
      exam_set_id: number;
      status: 'in_progress' | 'completed' | 'abandoned';
      started_at: string;
      time_remaining: number;
      current_section: string;
      current_question_index: number;
    };
  }) {
    return this.request('/test-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateTestSession(sessionId: number, updates: any) {
    return this.request(`/test-sessions/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  }

  // Test Answers
  async saveTestAnswer(answerData: {
    title: string;
    status: 'publish';
    meta: {
      session_id: number;
      question_id: number;
      selected_answer: number;
      is_correct: boolean;
      answered_at: string;
    };
  }) {
    return this.request('/test-answers', {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  }

  // Test Results
  async saveTestResult(resultData: {
    title: string;
    status: 'publish';
    meta: {
      session_id: number;
      user_id: number;
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
    };
  }) {
    return this.request('/test-results', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  // Authentication
  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  }

  async validateToken(token: string) {
    const response = await fetch(`${this.baseUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  }
}

// WordPress configuration
const wpConfig: WordPressConfig = {
  baseUrl: import.meta.env.VITE_WORDPRESS_URL || 'https://your-wordpress-site.com',
  username: import.meta.env.VITE_WP_USERNAME,
  applicationPassword: import.meta.env.VITE_WP_APP_PASSWORD,
};

export const wordpressAPI = new WordPressAPI(wpConfig);
export default wordpressAPI;