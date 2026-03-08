'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      if (res.ok) {
        setSuccess('Profil mis à jour avec succès');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Une erreur est survenue');
      }
    } catch {
      setError('Une erreur est survenue lors de la mise à jour');
    }
  };
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!deletePassword) {
      setError('Le mot de passe est requis pour supprimer le compte');
      return;
    }

    if (!confirm('Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          password: deletePassword
        }),
      });

      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de la suppression du compte');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la suppression du compte');
    }
  };

  return (
  <><div className="space-y-8"></div><form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Mettre à jour le profil
      </button>
    </form><div className="border-t pt-8">
        <h3 className="text-xl font-medium text-red-600 mb-4">Zone dangereuse</h3>
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Supprimer mon compte
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <p className="text-sm text-gray-600">
              Pour confirmer la suppression de votre compte, veuillez saisir votre mot de passe :
            </p>
            <div>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                required />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Confirmer la suppression
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                } }
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div></>
  );
}