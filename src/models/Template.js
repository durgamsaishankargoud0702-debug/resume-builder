import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['ATS', 'Modern', 'Minimal', 'Creative', 'Professional'],
        required: true,
    },
    previewUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);
