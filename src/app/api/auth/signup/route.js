import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();

        const { name, fullName, email, password } = await req.json();
        const finalName = name || fullName;

        // Validation
        if (!finalName || !email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'Name, email and password are required' },
                { status: 400 }
            );
        }

        console.log('Signup attempt for email:', email);

        if (password.length < 6) {
            return NextResponse.json(
                { status: 'error', message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        console.log('Existing user check result:', existingUser);

        if (existingUser) {
            console.log('User already exists, returning 400');
            return NextResponse.json(
                { status: 'error', message: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: finalName,
            email,
            password: hashedPassword,
        });

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isPremium: user.isPremium,
            purchasedTemplates: user.purchasedTemplates,
            createdAt: user.createdAt,
        };

        return NextResponse.json({
            status: 'success',
            message: 'Account created successfully',
            data: userData,
        });
    } catch (error) {
        console.error('Signup error details:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to create account', error: error.message },
            { status: 500 }
        );
    }
}
