'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { User, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface ProfileFormProps {
  user: { name: string; email: string; id: string; };
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
  const [showPass, setShowPass] = useState(false);
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
        body: JSON.stringify({ userId: user.id, ...formData }),
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
      setError('Le mot de passe est requis');
      return;
    }

    if (!confirm('Cette action est irréversible. Confirmer la suppression ?')) return;

    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, password: deletePassword }),
      });

      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de la suppression');
      }
    } catch {
      setError('Une erreur est survenue');
    }
  };

  const inputClass = "input-netflix mt-1";

  return (
    <div className="space-y-8">
      {/* Infos générales */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-[#E50914]/10 border border-[#E50914]/30 text-red-400 text-sm p-3 rounded">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/30 text-green-400 text-sm p-3 rounded">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-white font-semibold">Informations personnelles</h3>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Nom</label>
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={inputClass} />
        </div>

        <div className="border-t border-[#333] pt-5">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-[#E50914]" />
            <h3 className="text-white font-semibold">Changer le mot de passe</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mot de passe actuel</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={formData.currentPassword}
                  onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                  className={`${inputClass} pr-10`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white mt-0.5">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nouveau mot de passe</label>
              <input type="password" value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirmer le nouveau mot de passe</label>
              <input type="password" value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={inputClass} placeholder="••••••••" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-netflix w-full py-3 rounded">
          Mettre à jour
        </button>
      </form>

      {/* Zone dangereuse */}
      <div className="border border-[#E50914]/20 rounded p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#E50914]" />
          <h3 className="text-[#E50914] font-semibold">Zone dangereuse</h3>
        </div>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-4 py-2 rounded text-sm transition-colors">
            Supprimer mon compte
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-3">
            <p className="text-gray-400 text-sm">Confirmez avec votre mot de passe :</p>
            <input type="password" value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="input-netflix" required />
            <div className="flex gap-3">
              <button type="submit"
                className="bg-[#E50914] hover:bg-[#B20710] text-white px-4 py-2 rounded text-sm transition-colors">
                Confirmer la suppression
              </button>
              <button type="button" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                className="border border-[#333] text-gray-400 hover:text-white px-4 py-2 rounded text-sm transition-colors">
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
