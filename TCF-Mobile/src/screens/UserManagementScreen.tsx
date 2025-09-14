import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const UserManagementScreen: React.FC = () => {
  const { state, dispatch, createUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client' as 'admin' | 'client',
    isActive: true,
  });

  const handleAddUser = () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Check if username or email already exists
    const existingUser = state.users.find(
      u => u.username === formData.username || u.email === formData.email
    );

    if (existingUser) {
      Alert.alert('Erreur', 'Ce nom d\'utilisateur ou email existe déjà');
      return;
    }

    createUser(formData);
    resetForm();
    setShowAddForm(false);
    Alert.alert(
      'Succès', 
      `Utilisateur "${formData.username}" créé avec succès ! Il peut maintenant se connecter avec ces identifiants.`
    );
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUser: User = {
      ...editingUser,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      isActive: formData.isActive,
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    resetForm();
    setShowAddForm(false);
    setEditingUser(null);
    Alert.alert('Succès', 'Utilisateur mis à jour avec succès !');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === state.currentUser?.id) {
      Alert.alert('Erreur', 'Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_USER', payload: userId })
        },
      ]
    );
  };

  const handleToggleUserStatus = (userId: string) => {
    if (userId === state.currentUser?.id) {
      Alert.alert('Erreur', 'Vous ne pouvez pas désactiver votre propre compte');
      return;
    }

    dispatch({ type: 'TOGGLE_USER_STATUS', payload: userId });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'client',
      isActive: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const clientUsers = state.users.filter(u => u.role === 'client');
  const adminUsers = state.users.filter(u => u.role === 'admin');

  return (
    <ScrollView style={styles.container}>
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="people" size={20} color="#2563eb" />
          </View>
          <Text style={styles.statNumber}>{state.users.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="person" size={20} color="#16a34a" />
          </View>
          <Text style={styles.statNumber}>{clientUsers.length}</Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="shield" size={20} color="#9333ea" />
          </View>
          <Text style={styles.statNumber}>{adminUsers.length}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {/* Add User Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm(true)}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.addButtonText}>Nouvel Utilisateur</Text>
      </TouchableOpacity>

      {/* Users List */}
      <View style={styles.usersList}>
        <Text style={styles.usersListTitle}>Liste des Utilisateurs</Text>
        
        {state.users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={[
                    styles.roleBadge,
                    user.role === 'admin' ? styles.adminBadge : styles.clientBadge
                  ]}>
                    <Text style={[
                      styles.roleBadgeText,
                      user.role === 'admin' ? styles.adminBadgeText : styles.clientBadgeText
                    ]}>
                      {user.role === 'admin' ? 'Admin' : 'Client'}
                    </Text>
                  </View>
                  <Text style={styles.userDate}>{formatDate(user.createdAt)}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.userActions}>
              <TouchableOpacity
                onPress={() => handleToggleUserStatus(user.id)}
                disabled={user.id === state.currentUser?.id}
                style={[
                  styles.statusButton,
                  user.isActive ? styles.activeButton : styles.inactiveButton,
                  user.id === state.currentUser?.id && styles.disabledButton
                ]}
              >
                <Ionicons 
                  name={user.isActive ? "checkmark-circle" : "close-circle"} 
                  size={16} 
                  color={user.isActive ? "#16a34a" : "#6b7280"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleEditUser(user)}
                style={styles.editButton}
              >
                <Ionicons name="create" size={16} color="#2563eb" />
              </TouchableOpacity>
              
              {user.id !== state.currentUser?.id && (
                <TouchableOpacity
                  onPress={() => handleDeleteUser(user.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={16} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Add/Edit User Modal */}
      <Modal
        visible={showAddForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowAddForm(false);
          setEditingUser(null);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  resetForm();
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom d'utilisateur *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.username}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  placeholder="Nom d'utilisateur unique"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="adresse@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mot de passe *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  placeholder="Mot de passe sécurisé"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rôle</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      formData.role === 'client' && styles.roleOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, role: 'client' })}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      formData.role === 'client' && styles.roleOptionTextSelected
                    ]}>
                      Client
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      formData.role === 'admin' && styles.roleOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      formData.role === 'admin' && styles.roleOptionTextSelected
                    ]}>
                      Administrateur
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
              >
                <View style={[styles.checkbox, formData.isActive && styles.checkboxChecked]}>
                  {formData.isActive && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  Compte actif (l'utilisateur peut se connecter)
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingUser ? handleUpdateUser : handleAddUser}
              >
                <Ionicons name="save" size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>
                  {editingUser ? 'Mettre à jour' : 'Créer'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  usersList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  usersListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: '#f3e8ff',
  },
  clientBadge: {
    backgroundColor: '#dcfce7',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  adminBadgeText: {
    color: '#9333ea',
  },
  clientBadgeText: {
    color: '#16a34a',
  },
  userDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#dcfce7',
  },
  inactiveButton: {
    backgroundColor: '#f3f4f6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  editButton: {
    width: 32,
    height: 32,
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  roleOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  roleOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserManagementScreen;