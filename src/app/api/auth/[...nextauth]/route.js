import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    isPremium: user.isPremium,
                    premiumExpiry: user.premiumExpiry,
                    purchasedTemplates: user.purchasedTemplates,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.isPremium = user.isPremium;
                token.premiumExpiry = user.premiumExpiry;
                token.purchasedTemplates = user.purchasedTemplates;
            }
            if (trigger === 'update') {
                if (session?.isSubscriptionUpdate) {
                    token.isPremium = true;
                    token.premiumExpiry = session.premiumExpiry;
                }
                if (session?.isPremium !== undefined) token.isPremium = session.isPremium;
                if (session?.purchasedTemplate) {
                    if (!token.purchasedTemplates) token.purchasedTemplates = [];
                    if (!token.purchasedTemplates.includes(session.purchasedTemplate)) {
                        token.purchasedTemplates.push(session.purchasedTemplate);
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.isPremium = token.isPremium;
                session.user.premiumExpiry = token.premiumExpiry;
                session.user.purchasedTemplates = token.purchasedTemplates;
            }
            return session;
        }
    },
    pages: {
        signIn: '/', // Change this if you have a dedicated login page
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
