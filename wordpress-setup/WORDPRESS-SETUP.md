# 🎯 WordPress + React Setup Guide

## 📋 **CONFIGURATION WORDPRESS BACKEND**

### **Étape 1: Installation WordPress**
1. **Installez WordPress** sur votre serveur
2. **Activez les permaliens** (Réglages → Permaliens → Structure personnalisée: `/%postname%/`)
3. **Installez les plugins requis** :
   - **JWT Authentication for WP-API** (pour l'authentification)
   - **Advanced Custom Fields** (optionnel, pour une gestion plus facile)

### **Étape 2: Configuration du Backend**
1. **Copiez le code** de `wordpress-setup/functions.php`
2. **Ajoutez-le** dans le fichier `functions.php` de votre thème WordPress
3. **Sauvegardez** et rechargez votre site

### **Étape 3: Configuration des Permissions**
```php
// Dans wp-config.php, ajoutez :
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

### **Étape 4: Test de l'API**
Testez que l'API fonctionne :
- `https://votre-site.com/wp-json/wp/v2/exam-sets`
- `https://votre-site.com/wp-json/wp/v2/questions`

---

## ⚙️ **CONFIGURATION REACT FRONTEND**

### **Variables d'Environnement**
Créez un fichier `.env` :
```env
VITE_WORDPRESS_URL=https://votre-site-wordpress.com
VITE_WP_USERNAME=votre-username-admin
VITE_WP_APP_PASSWORD=votre-application-password
```

### **Génération du Mot de Passe d'Application**
1. **Allez** dans WordPress Admin → Utilisateurs → Votre Profil
2. **Descendez** jusqu'à "Mots de passe d'application"
3. **Créez** un nouveau mot de passe pour "TCF Simulator"
4. **Copiez** le mot de passe généré dans votre `.env`

---

## 🎯 **STRUCTURE DE DONNÉES WORDPRESS**

### **Custom Post Types Créés :**
- **exam_set** - Les examens TCF
- **question** - Les questions des examens
- **test_session** - Les sessions de test des utilisateurs
- **test_answer** - Les réponses des utilisateurs
- **test_result** - Les résultats finaux

### **Rôles Utilisateurs :**
- **tcf_admin** - Peut créer/modifier examens et questions
- **tcf_client** - Peut passer les tests et voir ses résultats
- **administrator** - Accès complet au système

---

## 🚀 **UTILISATION DANS REACT**

### **Exemple d'utilisation :**
```tsx
import { useWordPress } from './contexts/WordPressContext';

function ExamList() {
  const { state, loadExamSets } = useWordPress();
  
  useEffect(() => {
    loadExamSets();
  }, []);

  return (
    <div>
      {state.examSets.map(exam => (
        <div key={exam.id}>
          <h3>{exam.title.rendered}</h3>
          <p>{exam.meta.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 💰 **AVANTAGES WORDPRESS + REACT**

### ✅ **Pour Vos Clients**
- **Interface familière** - WordPress admin pour gérer le contenu
- **Gestion utilisateurs** - Système WordPress intégré
- **Extensibilité** - Plugins WordPress disponibles
- **SEO optimisé** - WordPress natif

### ✅ **Pour Vous**
- **Déploiement facile** - WordPress très répandu
- **Maintenance simple** - Mises à jour WordPress automatiques
- **Personnalisation** - Thèmes et plugins disponibles
- **Support communautaire** - Large communauté WordPress

---

## 🎉 **VOTRE SYSTÈME EST PRÊT !**

**Vous avez maintenant :**
- ✅ **Backend WordPress** complet avec API REST
- ✅ **Frontend React** connecté à WordPress
- ✅ **Authentification** sécurisée
- ✅ **Gestion complète** des examens TCF
- ✅ **Système de résultats** et certificats

**Votre TCF Simulator WordPress + React est opérationnel !** 🚀💰