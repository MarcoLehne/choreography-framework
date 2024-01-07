const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');

async function processVideo(filePath) {
  const outputImagePath = filePath.replace('.mp4', '-last-frame.jpg');
  const outputVideoPath = filePath.replace('.mp4', '-trimmed.mp4');

  const totalFrames = await getTotalFrames(filePath);
  const videoDuration = await getVideoDuration(filePath);

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .noAudio()
      .outputOptions('-vf', `select=eq(n\\,${totalFrames - 1})`)
      .frames(1)
      .output(outputImagePath)
      .on('end', () => {
        console.log('Last frame extracted');
        ffmpeg(filePath)
          .noAudio()
          .outputOptions(`-t ${videoDuration - 0.04}`) 
          .output(outputVideoPath)
          .on('end', () => {
            console.log('Video trimmed');
            resolve('save');
          })
          .on('error', (err) => {
            console.error('Error trimming video:', err);
            reject(err);
          })
          .run();
      })
      .on('error', (err) => {
        console.error('Error extracting frame:', err);
        reject(err);
      })
      .run();
  });
}

async function getTotalFrames(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, { path: ffprobe.path }, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve(videoStream.nb_frames);
      }
    });
  });
}

async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, { path: ffprobe.path }, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve(videoStream.duration);
      }
    });
  });
}

module.exports = processVideo;
