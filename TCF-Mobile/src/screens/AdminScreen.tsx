import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const AdminScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const adminFeatures = [
    {
      title: 'Gestion des Utilisateurs',
      description: 'Créer, modifier et gérer les comptes utilisateurs',
      icon: 'people',
      color: '#2563eb',
      onPress: () => navigation.navigate('UserManagement' as never),
    },
    {
      title: 'Questions d\'Écoute',
      description: 'Gérer les questions de compréhension orale',
      icon: 'headset',
      color: '#16a34a',
      onPress: () => Alert.alert('Info', 'Fonctionnalité en cours de développement'),
    },
    {
      title: 'Questions de Grammaire',
      description: 'Gérer les questions de structures de la langue',
      icon: 'create',
      color: '#f59e0b',
      onPress: () => Alert.alert('Info', 'Fonctionnalité en cours de développement'),
    },
    {
      title: 'Questions de Lecture',
      description: 'Gérer les questions de compréhension écrite',
      icon: 'document-text',
      color: '#9333ea',
      onPress: () => Alert.alert('Info', 'Fonctionnalité en cours de développement'),
    },
    {
      title: 'Examens',
      description: 'Créer et gérer les différents examens',
      icon: 'folder',
      color: '#dc2626',
      onPress: () => Alert.alert('Info', 'Fonctionnalité en cours de développement'),
    },
    {
      title: 'Statistiques',
      description: 'Voir les statistiques d\'utilisation',
      icon: 'analytics',
      color: '#0891b2',
      onPress: () => Alert.alert('Info', 'Fonctionnalité en cours de développement'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Panel d'Administration</Text>
            <Text style={styles.headerSubtitle}>Gérez le système TCF</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIcon}>
          <Ionicons name="shield-checkmark" size={32} color="#2563eb" />
        </View>
        <Text style={styles.welcomeTitle}>Bienvenue, Administrateur</Text>
        <Text style={styles.welcomeText}>
          Utilisez les outils ci-dessous pour gérer le système de test TCF, 
          les utilisateurs et le contenu des examens.
        </Text>
      </View>

      {/* Admin Features Grid */}
      <View style={styles.featuresGrid}>
        {adminFeatures.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={feature.onPress}
          >
            <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
              <Ionicons name={feature.icon as any} size={24} color={feature.color} />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <View style={styles.featureArrow}>
              <Ionicons name="chevron-forward" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Statistiques Rapides</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Examens</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Tests Passés</Text>
          </View>
        </View>
      </View>

      {/* System Info */}
      <View style={styles.systemCard}>
        <Text style={styles.systemTitle}>Informations Système</Text>
        <View style={styles.systemInfo}>
          <View style={styles.systemItem}>
            <Ionicons name="phone-portrait" size={16} color="#6b7280" />
            <Text style={styles.systemText}>Version Mobile: 1.0.0</Text>
          </View>
          <View style={styles.systemItem}>
            <Ionicons name="server" size={16} color="#6b7280" />
            <Text style={styles.systemText}>Statut: En ligne</Text>
          </View>
          <View style={styles.systemItem}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.systemText}>Dernière mise à jour: Aujourd'hui</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dbeafe',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    flex: 1,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  featureArrow: {
    marginLeft: 12,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  systemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  systemInfo: {
    gap: 12,
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  systemText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
});

export default AdminScreen;