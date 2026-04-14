import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { status: 'error', message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isPremium: user.isPremium,
            purchasedTemplates: user.purchasedTemplates,
            profilePhotoUrl: user.profilePhotoUrl,
            createdAt: user.createdAt,
        };

        return NextResponse.json({
            status: 'success',
            message: 'Login successful',
            data: userData,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to login', error: error.message },
            { status: 500 }
        );
    }
}
