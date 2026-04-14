import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    profilePhotoUrl: {
        type: String,
        default: null,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    premiumExpiry: {
        type: Date,
        default: null,
    },
    purchasedTemplates: {
        type: [String],
        default: [],
    },
    resetOtp: {
        type: String,
        default: null,
    },
    resetOtpExpiry: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

// Prevent model recompilation in Next.js development
export default mongoose.models.User || mongoose.model('User', UserSchema);
