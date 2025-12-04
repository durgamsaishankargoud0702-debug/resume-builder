import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
