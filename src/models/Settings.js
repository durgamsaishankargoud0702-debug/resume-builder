import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One settings document per user
    },
    selectedTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
    },
    photoShape: {
        type: String,
        enum: ['circle', 'square'],
        default: 'circle',
    },
    photoSize: {
        type: Number,
        default: 100, // Default size percentage or pixel value
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
