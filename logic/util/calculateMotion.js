const MAX_2D = 10;
const MAX_3D = 3;

function calculateMotion(choreoObject, axis) {

// this might actually need start frame and end frame index

  let choreoCopy = JSON.parse(JSON.stringify(choreoObject));


  let process_variable;

  process_variable = unpackAndExtract(choreoCopy.camera_motion_progression, axis);
  
  // if (axis === "3d_y") {
  //   console.log(process_variable)
  // }
  process_variable = distributeFrames(process_variable);
  process_variable = assignOnsetOriginAndOffsetTargetValue(process_variable, axis);
  process_variable = distributeValues(process_variable);
    
  process_variable = toString(process_variable);

  return process_variable;
}

function unpackAndExtract(timestampsPackages,axis) {

  let withExtracted = {};

  for (const [timestamps, timestampsPackage] of Object.entries(timestampsPackages)) {

    withExtracted[timestamps] = { ...timestampsPackage };

    // Assuming all lifecycles have the same properties, take the values from the first lifecycle.
    const firstActionObject = timestampsPackage[timestamps.split("-")[0]];
    
    if (firstActionObject.axis.hasOwnProperty(axis)) {
      let peak_value_raw = firstActionObject.axis[axis] * (axis.length === 1 ? MAX_2D : MAX_3D);
      withExtracted[timestamps].peak_value = peak_value_raw < 0 ? Math.floor(peak_value_raw) : Math.ceil(peak_value_raw);
    } else {
      withExtracted[timestamps].peak_value = 0;
    }

    withExtracted[timestamps].onset_graph =     firstActionObject.graph.onset_graph;
    withExtracted[timestamps].offset_graph =    firstActionObject.graph.offset_graph;
    withExtracted[timestamps].onset_duration =  firstActionObject.duration.onset_duration;
    withExtracted[timestamps].peak_duration =   firstActionObject.duration.peak_duration;
    withExtracted[timestamps].offset_duration = firstActionObject.duration.offset_duration;
    withExtracted[timestamps].onset_anchor =    firstActionObject.anchor.onset_anchor[axis.length === 1 ? "2D" : "3D"];
    withExtracted[timestamps].offset_anchor =   firstActionObject.anchor.offset_anchor[axis.length === 1 ? "2D" : "3D"];
    withExtracted[timestamps].onset_anchor_type = typeof firstActionObject.anchor.onset_anchor === 'object'? "absolute" : "relative" ;
    withExtracted[timestamps].offset_anchor_type = typeof firstActionObject.anchor.offset_anchor === 'object'? "absolute" : "relative" ;
    
    // Delete the extracted properties from each Lifecycle
    for (let key in timestampsPackage) {
      withExtracted[timestamps][key] = {};
    }
  }

  return withExtracted;
}
function distributeFrames(frameStampPackages) {

  // Iterate through each frameStamp and distribute frames according to onset, peak, and offset values
  for (const [frameStampKey, frameStampData] of Object.entries(frameStampPackages)) {
    const totalFrames = Object.keys(frameStampData)
                              .filter(key => !isNaN(key)).length; // Count only numeric keys for frames
    // Calculate initial frame counts
    let onsetFrames = Math.floor(totalFrames * frameStampData.onset_duration);
    let peakFrames = Math.floor(totalFrames * frameStampData.peak_duration);
    let offsetFrames = Math.floor(totalFrames * frameStampData.offset_duration);

    // Distribute remaining frames
    let distributedFrames = onsetFrames + peakFrames + offsetFrames;
    let remainingFrames = totalFrames - distributedFrames;

    // Assuming priority is given to onset, then peak, then offset
    while (remainingFrames > 0) {
        if (remainingFrames > 0) {
            onsetFrames++;
            remainingFrames--;
        }
        if (remainingFrames > 0) {
            peakFrames++;
            remainingFrames--;
        }
        if (remainingFrames > 0) {
            offsetFrames++;
            remainingFrames--;
        }
    }

    let frameCounter = 0;
    const frameKeys = Object.keys(frameStampData)
                            .filter(key => !isNaN(key))
                            .sort((a, b) => parseInt(a) - parseInt(b)); // Ensure keys are sorted numerically

    // Assign onset
    for (let i = 0; i < onsetFrames; i++, frameCounter++) {
      frameStampData[frameKeys[frameCounter]].function = "onset_duration";
    }

    // Assign peak
    for (let i = 0; i < peakFrames; i++, frameCounter++) {
      frameStampData[frameKeys[frameCounter]].function = "peak_duration";
    }

    // Assign offset, ensuring that we don't go beyond the total number of frames
    for (let i = 0; i < offsetFrames && frameCounter < totalFrames; i++, frameCounter++) {
      frameStampData[frameKeys[frameCounter]].function = "offset_duration";
    }
  }

  return frameStampPackages;
}
function assignOnsetOriginAndOffsetTargetValue(mergedFrameStampPackages, axis) {

  // Process each frame stamp package
  Object.entries(mergedFrameStampPackages).forEach(([key, package], index, array) => {

    if (package.onset_anchor === undefined || package.peak_value === 0) {
      package.onset_anchor_value = 0;
    } else {
      let temp_onset_value = package.onset_anchor * (axis.length === 1 ? MAX_2D : MAX_3D);
      if (temp_onset_value < 1 && temp_onset_value > 0) {
        temp_onset_value = Math.ceil(temp_onset_value);
      } else {
        temp_onset_value = Math.floor(temp_onset_value);
      }
        // temp_onset_value will always be a positive number 
      package.onset_anchor_value = package.peak_value < 0? - temp_onset_value : temp_onset_value;    
    }
    
    if (package.offset_anchor === undefined  || package.peak_value === 0) {
      package.offset_anchor_value = 0;
    } else {
      
      let temp_offset_value = package.offset_anchor * (axis.length === 1 ? MAX_2D : MAX_3D);
      if (temp_offset_value < 1 && temp_offset_value > 0) {
        temp_offset_value = Math.ceil(temp_offset_value);
      } else {
        temp_offset_value = Math.floor(temp_offset_value);
      }
        // temp_offset_value will always be a positive number 
      package.offset_anchor_value = package.peak_value < 0? - temp_offset_value : temp_offset_value; 
    }
    mergedFrameStampPackages[key] = package;
  });

  return mergedFrameStampPackages;
}
function interpolateValues(startValue, endValue, steps, graphType, currentIndex) {
  let factor;

  switch (graphType) {
    case 'linear':
      // Simple linear interpolation
      factor = currentIndex / steps;
      break;
    case 'exponential':
      // Simplified exponential - using a parabolic curve (x^2)
      factor = (currentIndex / steps) ** 2;
      break;
    // Add other cases for different graphTypes if needed
    default:
      factor = currentIndex / steps; // Default to linear if no graphType matches
  }

  let value = startValue + (endValue - startValue) * factor;
  let roundedValue;

  // Apply the specialized rounding mechanism
  if (value < 1 && value > 0) {
    // If the value is between 0 and 1, round away from zero
    roundedValue = Math.ceil(value);
  } else if (value > -1 && value < 0) {
    // If the value is between -1 and 0, round away from zero
    roundedValue = Math.floor(value);
  } else {
    // In all other cases, just round to the closest number
    roundedValue = Math.round(value);
  }

  return {
    "rounded": roundedValue,
    "unrounded_for_debug": value
  };
}

function distributeValues(INPUT) {
  for (let rangeKey in INPUT) {
    let [start, end] = rangeKey.split('-').map(Number);
    let dataRange = INPUT[rangeKey];

    // Determine the counts for onset and offset phases
    let onsetCount = Object.values(dataRange).filter(obj => 
      typeof obj === 'object' && obj !== null && obj.function === 'onset_duration'
    ).length;
    let offsetCount = Object.values(dataRange).filter(obj => 
      typeof obj === 'object' && obj !== null && obj.function === 'offset_duration'
    ).length;

    // Track current indices for onset and offset phases
    let onsetIndex = 0;
    let offsetIndex = 0;

    for (let i = start; i <= end; i++) {
      let frameKey = i.toString();
      let duration = dataRange[frameKey].function;
      let values;

      if (duration === 'onset_duration') {
        values = interpolateValues(
          dataRange.onset_anchor_value,
          dataRange.peak_value,
          onsetCount + 1,  // +1 since we start one step in and end one step before
          dataRange.onset_graph,
          onsetIndex++
        );
      } else if (duration === 'offset_duration') {
        values = interpolateValues(
          dataRange.peak_value,
          dataRange.offset_anchor_value,
          offsetCount,  // +1 for the same reason as above
          dataRange.offset_graph,
          offsetIndex++
        );
      } else if (duration === 'peak_duration') {
        // peak_value is a single value, so we wrap it to match structure
        values = {
          "rounded": dataRange.peak_value,
          "unrounded_for_debug": dataRange.peak_value
        };
      }

      // Assign the interpolated values to the current frame
      dataRange[frameKey].value = values["rounded"];
      dataRange[frameKey].value_for_debugging = values["unrounded_for_debug"];
    }
  }

  return INPUT; // Return the modified INPUT with the values distributed
}
function toString(mainObject) {
  let resultString = "";

  // Iterate over each range key in the mainObject
  for (let range in mainObject) {
    // Check if the property is indeed an object and not one of the additional properties
    if (typeof mainObject[range] === 'object' && mainObject[range] !== null) {
      // Now, iterate over each frame within this range
      for (let frame in mainObject[range]) {
        // Skip non-numeric keys
        if (!isNaN(frame)) {
          let frameData = mainObject[range][frame];
          resultString += `${frame}:(${frameData.value}), `;
        }
      }
    }
  }
  
  // Remove the last comma and space from the result string
  resultString = resultString.replace(/, $/, '');

  return resultString;
}

module.exports = calculateMotion;