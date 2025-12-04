const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/resume_builder';

async function dropIndex() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // List all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));

        // Drop the providerId_1 index
        try {
            await collection.dropIndex('providerId_1');
            console.log('✅ Successfully dropped providerId_1 index');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('ℹ️  providerId_1 index does not exist');
            } else {
                throw error;
            }
        }

        // List indexes after dropping
        const indexesAfter = await collection.indexes();
        console.log('Indexes after drop:', JSON.stringify(indexesAfter, null, 2));

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropIndex();
