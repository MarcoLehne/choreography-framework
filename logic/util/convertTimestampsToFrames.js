function convertTimestampsToFrames(choreoObject) {

  for (let i = 0; i < choreoObject.view.length; i++) {
    choreoObject.view.at(i).timestamp = Math.round(Number(choreoObject.view.at(i).timestamp) * choreoObject.fps).toString();
  }
}

module.exports = convertTimestampsToFrames;