import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ status: 'error', message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // General error to prevent email enumeration, though they should have received an OTP to get here anyway
            return NextResponse.json({ status: 'error', message: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Verify OTP existence and match
        if (!user.resetOtp || user.resetOtp !== otp) {
            return NextResponse.json({ status: 'error', message: 'Invalid OTP' }, { status: 400 });
        }

        // Verify OTP has not expired
        if (!user.resetOtpExpiry || new Date() > user.resetOtpExpiry) {
            return NextResponse.json({ status: 'error', message: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP fields using updateOne to bypass strict schema validation on legacy accounts
        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword, resetOtp: null, resetOtpExpiry: null } }
        );

        return NextResponse.json({ status: 'success', message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ status: 'error', message: 'An error occurred while resetting your password' }, { status: 500 });
    }
}
