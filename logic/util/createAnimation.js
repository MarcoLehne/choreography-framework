const calculateMotion = require('./calculateMotion');

function createAnimation(choreoFile) {

  for (const axis of ["x","y","z","3d_x","3d_y","3d_z"]) { 
    if(axis.length === 1) {
      choreoFile["translation_" + axis] = calculateMotion(choreoFile, axis);
    } else {
      choreoFile["rotation_" + axis] = calculateMotion(choreoFile, axis);
    }
  }
}

module.exports = createAnimation;