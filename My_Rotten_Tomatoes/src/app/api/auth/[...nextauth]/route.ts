import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Informations manquantes');
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            console.log('Utilisateur non trouvé:', credentials.email);
            return null;
          }

          // Utilisation directe de bcrypt pour la comparaison
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.log('Mot de passe invalide pour:', user.email);
            return null;
          }

          console.log('Connexion réussie pour:', user.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };