const express = require('express');
const fsPromises = require('fs/promises')
const fs = require('fs')
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(
    cors({
        origin: '*'
    })
)

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const buffer = req.file.buffer;
        const selectedFormat = req.body.format || 'png';

        const image = await Jimp.read(buffer);
        const convertedBuffer = await image.getBufferAsync(Jimp[`MIME_${selectedFormat.toUpperCase()}`]);

        const filename = `converted.${selectedFormat}`;
        const filePath = path.join(__dirname, 'images', filename);

        await fsPromises.writeFile(filePath, convertedBuffer);

        console.log(selectedFormat)
        res.status(200).send('Image converted and saved successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during conversion.');
    }
});

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images', imageName);

    res.sendFile(imagePath);
});

app.get('/download/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images', imageName);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=${imageName}`);

    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
