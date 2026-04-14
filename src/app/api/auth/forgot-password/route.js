import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Resend } from 'resend';

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ status: 'error', message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // Security best practice: Always return 200 even if user doesn't exist to prevent email enumeration
        if (!user) {
            return NextResponse.json({ status: 'success', message: 'If an account exists, a reset link has been sent.' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // OTP expires in 15 minutes
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); 

        await User.updateOne(
            { _id: user._id },
            { $set: { resetOtp: otp, resetOtpExpiry: otpExpiry } }
        );

        // Check if API Key is configured
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not found. OTP generated but email not sent. OTP:', otp);
            return NextResponse.json({ 
                status: 'success', 
                message: 'If an account exists, a reset link has been sent.',
                _debug: { otp } 
            });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Resume Builder Pro <onboarding@resend.dev>',
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #3b82f6;">Password Reset Request</h2>
                    <p>We received a request to reset your password for Resume Builder Pro.</p>
                    <p>Your one-time password (OTP) is:</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="letter-spacing: 5px; color: #1e293b; margin: 0;">${otp}</h1>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #64748b;">© ${new Date().getFullYear()} Resume Builder Pro. All rights reserved.</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ status: 'error', message: 'Failed to dispatch email via Resend' }, { status: 500 });
        }

        return NextResponse.json({ status: 'success', message: 'If an account exists, a reset link has been sent.' });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ status: 'error', message: `Server Error: ${error.message}` }, { status: 500 });
    }
}
