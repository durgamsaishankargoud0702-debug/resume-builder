import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Try to find existing test user
        let user = await User.findOne({ email: 'test@example.com' });

        // If not found, create one
        if (!user) {
            user = await User.create({
                fullName: 'Test User',
                email: 'test@example.com',
                profilePhotoUrl: null,
                authProvider: 'google',
                providerId: 'test-google-id-12345',
            });
            console.log('✅ Test user created successfully');
        } else {
            console.log('✅ Test user already exists');
        }

        return NextResponse.json({
            status: 'success',
            message: 'MongoDB connection successful',
            data: user,
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to connect to MongoDB',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
