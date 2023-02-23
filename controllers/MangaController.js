

import mangas from "../models/Manga.js";

export const getAllMangas = async (_, res) => {
    try {
        const hospitals = await Hospital.find().sort({
            time: 1,
            address: 1,
            imageUrl: 1
        });
        if(!hospitals){
            return res.status(404).json({
                message: 'Hospitals not found'
            });
        }
        res.json({
            hospitals
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'No access'
        });
    }
};

export const updateMangaInfo = async (req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(req.body.id, {$set: {
                address: req.body.address,
                time: req.body.time,
                phone: req.body.phone
            }});
        res.json(updatedHospital);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
};

export const uploadManga = async (req, res) => {
    try {
        const newDocument = new mangas({
            title: req.body.title,
            linkToPdf: req.file.filename,
            linkToImage: req.file.image,
            issue: req.body.issue,
            category: req.body.category,
        });

        const newManga = await newDocument.save();


        const { hashedPassword, ...userData } = newManga._doc;

        res.json({
            ...userData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to register'
        });
    }
};
