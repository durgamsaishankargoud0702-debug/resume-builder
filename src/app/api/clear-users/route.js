import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function DELETE() {
    try {
        await dbConnect();

        // Delete all users (for testing purposes)
        const result = await User.deleteMany({});

        return NextResponse.json({
            status: 'success',
            message: `Deleted ${result.deletedCount} users`,
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to delete users', error: error.message },
            { status: 500 }
        );
    }
}
