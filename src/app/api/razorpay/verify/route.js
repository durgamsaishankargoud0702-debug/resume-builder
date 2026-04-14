import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, templateId, isSubscription } = await req.json();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await dbConnect();
            const user = await User.findById(session.user.id);
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            // Update user purchased templates or subscription pass
            if (isSubscription) {
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 Month Pass
                await User.updateOne(
                    { _id: session.user.id },
                    { $set: { isPremium: true, premiumExpiry: expiryDate } }
                );
                return NextResponse.json({
                    status: 'success',
                    message: 'Payment verified and 1-Month Premium Pass activated',
                    expiryDate: expiryDate
                });
            } else if (templateId) {
                await User.updateOne(
                    { _id: session.user.id },
                    { $addToSet: { purchasedTemplates: templateId } }
                );
            }

            return NextResponse.json({
                status: 'success',
                message: 'Payment verified and template unlocked',
            });
        } else {
            return NextResponse.json({
                status: 'error',
                message: 'Invalid payment signature',
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Razorpay verification error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
