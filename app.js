const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, './build')));

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(require('./routes/createChoreoFileRoutes'));
app.use(require('./routes/uploadChoreoFileRoutes'));

app.use(require('./routes/downloadSettingsRoutes'));
app.use(require('./routes/downloadChoreoFileRoutes'));

app.use(require('./routes/uploadVideoRoutes'));
app.use(require('./routes/downloadImageRoutes'));
app.use(require('./routes/downloadVideoRoutes'));

app.use(require('./routes/getChoreoDataRoutes'));
app.use(require('./routes/updateChoreoFileRoutes'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
  

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
