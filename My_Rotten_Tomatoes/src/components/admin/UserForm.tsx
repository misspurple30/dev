'use client';

import { useState } from 'react';
import { addUser, updateUser } from '@/lib/actions/admin';

interface UserFormProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
  onSuccess?: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user' as const
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user) {
        // Mode modification
        await updateUser(user.id, {
          ...formData,
          password: formData.password || undefined // Ne pas envoyer si vide
        });
      } else {
        // Mode ajout
        await addUser(formData);
      }

      setFormData({ name: '', email: '', password: '', role: 'user' });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {user ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required={!user}
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Rôle
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'En cours...' : user ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
}