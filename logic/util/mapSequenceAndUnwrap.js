const createAnimation = require('./createAnimation');

function mapSequenceAndUnwrap(fromTimestampIndex, toTimestampIndex, choreoObject) {

  createCameraMotionProgression(fromTimestampIndex, toTimestampIndex, choreoObject);
  spreadCameraMotionProgression(fromTimestampIndex, toTimestampIndex, choreoObject);
  createAnimation(choreoObject);
}

function createCameraMotionProgression(fromTimestampIndex, toTimestampIndex, choreoObject) {
  
  choreoObject.camera_motion_progression = {};

  for (let i = fromTimestampIndex; i <= toTimestampIndex; i++) {

    let sequenceIndex = choreoObject.view.at(i).sequence;

    if (sequenceIndex !== 0) {
    
      sequenceIndex -= 1; // we have a base-1 compendium

      let camera_motion_of_a_sequence = [];
      for (let value of Object.values(choreoObject.sequence_compendium.at(sequenceIndex).values).flat()) {
        camera_motion_of_a_sequence.push(...value.camera_motions);
      }

      for (let ii = i; ii < i + camera_motion_of_a_sequence.length; ii++) {

        choreoObject.camera_motion_progression[choreoObject.view.at(ii).timestamp] = camera_motion_of_a_sequence.at(ii - i);
      }
      i += camera_motion_of_a_sequence.length - 1;
    }
  }
}
function spreadCameraMotionProgression(fromTimestampIndex, toTimestampIndex, choreoObject) {

  const cameraMotionProgression = { ...choreoObject.camera_motion_progression };

  const newCameraMotionProgression = {};
  for (let i = fromTimestampIndex; i <= toTimestampIndex; i++) {
    
    let currentCameraMotion = cameraMotionProgression[choreoObject.view.at(i).timestamp];
    
    let startFrame = Number(choreoObject.view.at(i).timestamp);
    let endFrame = Number(choreoObject.view.at(i + 1).timestamp);

    let collect = {};
    for (let ii = startFrame; ii < endFrame; ii++) {
      collect[ii] = currentCameraMotion;
    }
    newCameraMotionProgression[`${startFrame}-${endFrame - 1}`] = JSON.parse(JSON.stringify(collect));
  }
  choreoObject.camera_motion_progression = newCameraMotionProgression;
}

module.exports = mapSequenceAndUnwrap;