import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GCLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

export default {
    onUpload: async (req, res) => {
        try {
            const { characterUUID } = req.body; // Get characterUUID from request body
            console.log(characterUUID)

            if (!characterUUID) {
                return res.status(400).send({ message: 'Character UUID is required.' });
            }
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }

            // Create a blob (file) in Google Cloud Storage
            const newFileName = Date.now() + path.extname(req.file.originalname);
            const blob = bucket.file(newFileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on('error', err => {
                res.status(500).send({ message: 'Error uploading file: ' + err.message });
            });

            blobStream.on('finish', async () => {
                // Public URL for accessing the file
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                // Delete old images associated with this characterUUID except the new one
                await deleteOldImages(characterUUID, newFileName);

                // Return the uploaded image URL without saving it in the database
                res.status(200).send({
                    message: 'File uploaded successfully, and previous images deleted.',
                    imageUrl: publicUrl,
                });
            });

            blobStream.end(req.file.buffer);
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).send({ message: 'Error uploading file: ' + error.message });
        }
    },
};

// Helper function to delete old images in Google Cloud Storage
async function deleteOldImages(characterUUID, newFileName) {
    try {
        // Find all objects (images) in the bucket that belong to the characterUUID
        const [files] = await bucket.getFiles({
            prefix: characterUUID, // Assuming you store the characterUUID as part of the file name
        });

        const deletePromises = [];

        files.forEach(file => {
            if (file.name !== newFileName) {
                // Delete files except the newly uploaded image
                deletePromises.push(file.delete());
            }
        });

        await Promise.all(deletePromises); // Wait for all old images to be deleted

        console.log('Old images deleted successfully.');
    } catch (error) {
        console.error('Error deleting old images:', error);
    }
}
