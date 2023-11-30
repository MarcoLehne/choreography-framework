const calculateMaxFrames = require('./calculateMaxFrames');
const convertTimestampsToFrames = require('./convertTimestampsToFrames');
const mapPrompts = require('./mapPrompts.js');
const mapSequenceAndUnwrap = require('./mapSequenceAndUnwrap.js');
const cleanUp = require('./cleanUp.js');

function processUserInput(fromTimestampIndex, toTimestampIndex, choreoObject) {

  // this function manipulates the choreoObject, which is the .choreo file represented as an object
  // so that it can be merged with template settings to generate the user's settings file
  // it leaves the actual .choreo file on the server untouched

  calculateMaxFrames(fromTimestampIndex, toTimestampIndex, choreoObject);
  // -> creates max_frames property on the choreoObject
  
  convertTimestampsToFrames(choreoObject);

  mapPrompts(fromTimestampIndex, toTimestampIndex, choreoObject);
  // -> creates cond_prompts property on the choreoObject

  mapSequenceAndUnwrap(fromTimestampIndex, toTimestampIndex, choreoObject);
  // -> creates all the animation properties on the choreoObject

  cleanUp(choreoObject);
}

module.exports = processUserInput;
