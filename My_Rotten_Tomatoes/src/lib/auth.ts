import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email })
            .select('+password +role')
            .lean();
          
          if (!user) {
            throw new Error('Email incorrect');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error('Mot de passe incorrect');
          }

          console.log('Utilisateur trouvé:', {
            id: user._id,
            role: user.role,
            name: user.name
          });

          const userRole = user.role || 'user';
          console.log('Rôle attribué:', userRole);

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: userRole,
            image: user.image //on va voir aprés
          };
        } catch (error) {
          console.error('Erreur d\'authentification détaillée:', error);
          throw new Error('Erreur lors de la connexion');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        console.log('JWT Callback - User:', user);
        
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      console.log('JWT Callback - Token final:', token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log('Session Callback - Token:', token);
        
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      
      console.log('Session Callback - Session finale:', session);
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
};