const express = require('express');
const router = express.Router();
const createChoreoFile = require('../logic/endpoints/createChoreoFile');
const updateDirectoriesJson = require('../logic/aws/updateDirectoriesJson');

module.exports = (s3) => {
    router.post('/createChoreoFile', async (req, res) => {
        try {
            const result = await createChoreoFile(s3, req.headers['x-session-id'], req.body, process.env.AWS_S3_BUCKET);
            
            if (result === 'success') {
                await updateDirectoriesJson(s3, req.headers['x-session-id'], new Date().toISOString());
                res.json({ message: "success" });
            } else {
                res.status(500).json({ message: 'Creation failed' });
            }
        } catch (error) {
            console.error('Error during file creation:', error);
            res.status(500).json({ message: 'Server error during file creation' });
        }
    });

    return router;
};
