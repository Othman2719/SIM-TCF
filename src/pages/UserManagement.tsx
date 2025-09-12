import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Users, Mail, Calendar, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';

const UserManagement: React.FC = () => {
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
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Check if username or email already exists
    const existingUser = state.users.find(
      u => u.username === formData.username || u.email === formData.email
    );

    if (existingUser) {
      alert('Ce nom d\'utilisateur ou email existe déjà');
      return;
    }

    createUser(formData);
    resetForm();
    setShowAddForm(false);
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
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === state.currentUser?.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    if (userId === state.currentUser?.id) {
      alert('Vous ne pouvez pas désactiver votre propre compte');
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
      month: 'long',
      day: 'numeric',
    });
  };

  const clientUsers = state.users.filter(u => u.role === 'client');
  const adminUsers = state.users.filter(u => u.role === 'admin');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600 mt-1">
            Gérez les comptes utilisateurs et leurs accès au système
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{state.users.length}</p>
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{clientUsers.length}</p>
              <p className="text-sm text-gray-600">Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminUsers.length}</p>
              <p className="text-sm text-gray-600">Administrateurs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </h3>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom d'utilisateur unique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="adresse@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mot de passe sécurisé"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'client' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="client">Client</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Compte actif (l'utilisateur peut se connecter)
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingUser ? 'Mettre à jour' : 'Créer'}</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Utilisateurs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      disabled={user.id === state.currentUser?.id}
                      className={`flex items-center space-x-1 ${
                        user.id === state.currentUser?.id ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600">Actif</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-400">Inactif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.id !== state.currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;