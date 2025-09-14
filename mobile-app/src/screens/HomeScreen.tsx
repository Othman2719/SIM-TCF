import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const startTest = () => {
    Alert.alert('Test TCF', 'Fonctionnalité en cours de développement');
  };

  const viewResults = () => {
    Alert.alert('Résultats', 'Fonctionnalité en cours de développement');
  };

  return (
    <LinearGradient
      colors={['#3B82F6', '#1E40AF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenue,</Text>
          <Text style={styles.userName}>{user?.username || 'Utilisateur'}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={startTest}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.menuGradient}
            >
              <Text style={styles.menuIcon}>🎯</Text>
              <Text style={styles.menuTitle}>Nouveau Test</Text>
              <Text style={styles.menuSubtitle}>Commencer un test TCF</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={viewResults}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.menuGradient}
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuTitle}>Mes Résultats</Text>
              <Text style={styles.menuSubtitle}>Voir mes performances</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.menuGradient}
            >
              <Text style={styles.menuIcon}>📚</Text>
              <Text style={styles.menuTitle}>Entraînement</Text>
              <Text style={styles.menuSubtitle}>Exercices pratiques</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.menuGradient}
            >
              <Text style={styles.menuIcon}>🏆</Text>
              <Text style={styles.menuTitle}>Certificats</Text>
              <Text style={styles.menuSubtitle}>Mes certifications</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuGradient: {
    padding: 20,
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;