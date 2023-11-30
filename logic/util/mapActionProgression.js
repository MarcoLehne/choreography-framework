function mapActionProgression(config){

  const axis_compendium = require('../compendium/axis_compendium.json');
  const phase_compendium = require('../compendium/phase_compendium.json');
  const anchor_compendium = require('../compendium/anchor_compendium.json');
  const graph_compendium = require('../compendium/graph_compendium.json');

  let last_axis_object;
  let last_phase_object;
  let last_anchor_object;
  let last_graph_object;

  for (let framestamp in config["action_progression"]) {
    
    if (config["action_progression"][framestamp].hasOwnProperty("axis_object")) {
      last_axis_object = config["action_progression"][framestamp]["axis_object"];
    }

    if (config["action_progression"][framestamp].hasOwnProperty("phase_object")) {
      last_phase_object = config["action_progression"][framestamp]["phase_object"];
    }
    
    if (config["action_progression"][framestamp].hasOwnProperty("anchor_object")) {
      last_anchor_object = config["action_progression"][framestamp]["anchor_object"];
    }
    
    if (config["action_progression"][framestamp].hasOwnProperty("graph_object")) {
      last_graph_object = config["action_progression"][framestamp]["graph_object"];
    }

    config["action_progression"][framestamp]["axis_object"] = axis_compendium[last_axis_object]["camera_parameters"];
    config["action_progression"][framestamp]["phase_object"] = phase_compendium[last_phase_object];
    config["action_progression"][framestamp]["anchor_object"] = anchor_compendium[last_anchor_object];
    config["action_progression"][framestamp]["graph_object"] = graph_compendium[last_graph_object];
  }
}

module.exports = mapActionProgression;