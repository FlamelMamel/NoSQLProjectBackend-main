import mongoose from 'mongoose';

const MangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    linkToPdf: {
        type: String,
        required: true
    },
    linkToImage: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
});

export default mongoose.model('Manga', MangaSchema);