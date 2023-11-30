function calculateMaxFrames(fromTimestampIndex, toTimestampIndex, choreoObject) {

  toTimestampIndex ++;

  choreoObject.max_frames = Math.round(
    (choreoObject.view.at(toTimestampIndex).timestamp - choreoObject.view.at(fromTimestampIndex).timestamp) * choreoObject.fps);
}

module.exports = calculateMaxFrames;