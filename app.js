require('dotenv').config();
const express = require('express');
const sslify = require('express-sslify');
const cors = require('cors');
const path = require('path');
const { S3 } = require('@aws-sdk/client-s3');
const app = express();
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const deleteOldDirectories = require('./logic/aws/deleteOldDirectories');

if (process.env.NODE_ENV === 'production') {
  app.use(sslify.HTTPS({ trustProtoHeader: true }));
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.AWS_REGION
});

app.use(cors());

app.use(express.static(path.join(__dirname, './build')));

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(require('./routes/createChoreoFileRoutes')(s3));
app.use(require('./routes/uploadChoreoFileRoutes')(s3));

app.use(require('./routes/downloadSettingsRoutes')(s3));
app.use(require('./routes/downloadChoreoFileRoutes')(s3));

app.use(require('./routes/uploadVideoRoutes'));
app.use(require('./routes/downloadImageRoutes')(s3));
app.use(require('./routes/downloadVideoRoutes')(s3));

app.use(require('./routes/getChoreoDataRoutes')(s3));
app.use(require('./routes/updateChoreoFileRoutes')(s3));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });

cron.schedule('0 0 * * *', () => {
    deleteOldDirectories(s3);
});

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});
