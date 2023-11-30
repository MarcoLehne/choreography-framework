function spreadSequenceProgression(config) {

  // This will hold the last known good configuration
  let lastKnownConfig;

  // Iterate over the frame range
  for (let frame = 0; frame < config.max_frames; frame++) {
    // If an entry exists for this frame, update lastKnownConfig
    if (config.sequence_progression[frame.toString()]) {
      lastKnownConfig = config.sequence_progression[frame.toString()];
    } else {
      // If an entry doesn't exist, create it with the value of lastKnownConfig
      config.sequence_progression[frame.toString()] = lastKnownConfig;
    }
  }
}

module.exports = spreadSequenceProgression;