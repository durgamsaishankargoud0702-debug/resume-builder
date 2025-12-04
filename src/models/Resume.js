import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    summary: {
        type: String,
        trim: true,
    },
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String,
    }],
    education: [{
        school: String,
        degree: String,
        year: String,
        description: String,
    }],
    skills: [{
        type: String,
        trim: true,
    }],
    projects: [{
        name: String,
        description: String,
        link: String,
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: String,
    }],
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
