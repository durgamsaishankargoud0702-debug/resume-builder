import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    loginTime: {
        type: Date,
        default: Date.now,
    },
    logoutTime: {
        type: Date,
    },
    device: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
});

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
