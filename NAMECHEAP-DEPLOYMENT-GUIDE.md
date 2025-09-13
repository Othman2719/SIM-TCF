# 🚀 GUIDE COMPLET: DÉPLOIEMENT NAMECHEAP + SUPABASE

## 📋 ÉTAPES COMPLÈTES POUR VOTRE TCF SIMULATOR

### 🎯 **ÉTAPE 1: CONFIGURATION SUPABASE (Base de Données)**

#### 1.1 Créer un Projet Supabase
1. Allez sur **https://supabase.com**
2. **Créez un compte** gratuit
3. **Créez un nouveau projet**
   - Nom: `tcf-simulator-pro`
   - Mot de passe: `votre-mot-de-passe-fort`
   - Région: `Europe (eu-west-1)`

#### 1.2 Configurer la Base de Données
1. Dans **SQL Editor**, exécutez ce script:

```sql
-- Créer les tables principales
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exam_sets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  difficulty_level TEXT DEFAULT 'mixed',
  time_limit_minutes INTEGER DEFAULT 90,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_set_id INTEGER REFERENCES exam_sets(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('listening', 'grammar', 'reading')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  audio_url TEXT,
  image_url TEXT,
  explanation TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_set_id INTEGER REFERENCES exam_sets(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  time_remaining INTEGER DEFAULT 5400,
  current_section TEXT DEFAULT 'listening',
  current_question_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  answered_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, question_id)
);

CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exam_set_id INTEGER REFERENCES exam_sets(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  tcf_level TEXT DEFAULT 'A1',
  listening_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  reading_score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  completion_time_minutes INTEGER DEFAULT 0,
  certificate_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Everyone can read active exam sets" ON exam_sets FOR SELECT USING (is_active = true);
CREATE POLICY "Everyone can read questions from active exam sets" ON questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM exam_sets WHERE exam_sets.id = questions.exam_set_id AND exam_sets.is_active = true)
);

CREATE POLICY "Users can manage own test sessions" ON test_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own test answers" ON test_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM test_sessions WHERE test_sessions.id = test_answers.session_id AND test_sessions.user_id = auth.uid())
);
CREATE POLICY "Users can read own test results" ON test_results FOR SELECT USING (auth.uid() = user_id);

-- Insérer des données de test
INSERT INTO exam_sets (name, description, is_active) VALUES 
('TCF - Examen Principal', 'Examen principal du Test de Connaissance du Français', true),
('TCF - Examen 2', 'Deuxième examen du Test de Connaissance du Français', false);

-- Créer un utilisateur admin par défaut
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@tcf.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
);

INSERT INTO users (id, email, username, role, is_active) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@tcf.com', 'admin', 'admin', true);
```

#### 1.3 Récupérer les Clés Supabase
1. Allez dans **Settings → API**
2. Copiez:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 🎯 **ÉTAPE 2: CONFIGURATION NAMECHEAP**

#### 2.1 Préparer l'Hébergement
1. **Connectez-vous** à votre compte Namecheap
2. **Allez** dans cPanel de votre hébergement
3. **Créez** un sous-domaine (ex: `tcf.votredomaine.com`)

#### 2.2 Configuration des Variables d'Environnement
1. **Créez** le fichier `.env` dans votre projet:
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-supabase
VITE_APP_URL=https://tcf.votredomaine.com
```

### 🎯 **ÉTAPE 3: BUILD ET DÉPLOIEMENT**

#### 3.1 Préparer l'Application
```bash
# Installer les dépendances
npm install

# Créer le build de production
npm run build
```

#### 3.2 Upload sur Namecheap
1. **Compressez** le dossier `dist/` en ZIP
2. **Connectez-vous** au File Manager de cPanel
3. **Uploadez** le ZIP dans `public_html/tcf/`
4. **Décompressez** le fichier
5. **Déplacez** tout le contenu de `dist/` vers `public_html/tcf/`

#### 3.3 Configuration .htaccess
Créez le fichier `.htaccess` dans `public_html/tcf/`:
```apache
RewriteEngine On
RewriteBase /tcf/

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /tcf/index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>
```

### 🎯 **ÉTAPE 4: TEST ET VÉRIFICATION**

#### 4.1 Tester l'Application
1. **Visitez**: `https://tcf.votredomaine.com`
2. **Connectez-vous** avec: `admin@tcf.com` / `admin123`
3. **Testez** l'ajout de questions
4. **Vérifiez** la synchronisation en temps réel

#### 4.2 Vérifier la Base de Données
1. **Allez** dans Supabase → Table Editor
2. **Vérifiez** que les données apparaissent
3. **Testez** depuis un autre appareil

### 🎯 **ÉTAPE 5: FONCTIONNALITÉS AVANCÉES**

#### 5.1 Sauvegarde Automatique
- ✅ **Progression sauvée** toutes les 30 secondes
- ✅ **Reprise automatique** si déconnexion
- ✅ **Synchronisation** multi-appareils

#### 5.2 Administration en Temps Réel
- ✅ **Questions ajoutées** apparaissent immédiatement
- ✅ **Examens activés/désactivés** en direct
- ✅ **Résultats** sauvés automatiquement

### 🎯 **ÉTAPE 6: MAINTENANCE**

#### 6.1 Mises à Jour
```bash
# Pour mettre à jour l'application
npm run build
# Re-upload le dossier dist/
```

#### 6.2 Monitoring
- **Supabase Dashboard** pour surveiller la DB
- **Namecheap cPanel** pour les logs
- **Google Analytics** pour le trafic

## ✅ **RÉSULTAT FINAL**

Votre TCF Simulator Pro sera:
- 🌐 **Accessible** depuis n'importe où
- 💾 **Sauvegarde automatique** des données
- 🔄 **Synchronisation** temps réel
- 📱 **Multi-appareils** compatible
- 🔒 **Sécurisé** avec Supabase
- ⚡ **Rapide** sur Namecheap

**Votre solution commerciale est prête !** 💰🚀