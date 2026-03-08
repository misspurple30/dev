import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Movie from '@/models/Movie';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { userId, password } = await request.json();

    if (session.user.id !== userId) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }

    await connectDB();
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 400 });
    }

    await Promise.all([
      Movie.updateMany(
        { favorites: userId },
        { $pull: { favorites: userId } }
      ),
      Movie.updateMany(
        { 'reviews.userId': userId },
        { $pull: { reviews: { userId: userId } } }
      ),
      User.findByIdAndDelete(userId)
    ]);

    return NextResponse.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du compte' },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { userId, name, email, currentPassword, newPassword } = await request.json();

    if (session.user.id !== userId) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 403 });
    }

    await connectDB();
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ message: 'Mot de passe actuel incorrect' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    user.name = name;
    user.email = email;
    await user.save();

    return NextResponse.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}