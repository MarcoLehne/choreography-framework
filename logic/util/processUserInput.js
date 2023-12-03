const calculateMaxFrames = require('./calculateMaxFrames');
const convertTimestampsToFrames = require('./convertTimestampsToFrames');
const mapPrompts = require('./mapPrompts.js');
const mapSequenceAndUnwrap = require('./mapSequenceAndUnwrap.js');
const levelTimestampsZoZero = require('./levelTimestampsToZero.js');
const cleanUp = require('./cleanUp.js');

function processUserInput(fromTimestampIndex, toTimestampIndex, choreoObject) {

  // this function manipulates the choreoObject, which is the .choreo file represented as an object
  // so that it can be merged with template settings to generate the user's settings file
  // it leaves the actual .choreo file on the server untouched

  fromTimestampIndex = Number(fromTimestampIndex);
  toTimestampIndex = Number(toTimestampIndex);

  calculateMaxFrames(fromTimestampIndex, toTimestampIndex, choreoObject);
    
  convertTimestampsToFrames(choreoObject);

  levelTimestampsZoZero(choreoObject, fromTimestampIndex);

  mapPrompts(fromTimestampIndex, toTimestampIndex, choreoObject);

  mapSequenceAndUnwrap(fromTimestampIndex, toTimestampIndex, choreoObject);

  cleanUp(choreoObject);
}

module.exports = processUserInput;
