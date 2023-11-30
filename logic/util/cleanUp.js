function cleanUp(config) {

  delete config["timestamps"];
  delete config["fps"];
  delete config["sequence_progression"];
  delete config["preceding_axis_object"];
  delete config["succeeding_axis_object"];
  delete config["sequence_compendium"];
  delete config["view"];
  delete config["camera_motion_progression"];
  delete config["name"];
  delete config["width"];
  delete config["height"];
  delete config["prompt"];

}

module.exports = cleanUp;