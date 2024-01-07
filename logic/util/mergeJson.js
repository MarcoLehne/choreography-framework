function mergeJson(base, updates) {
  Object.keys(updates).forEach(key => {
    if (key === 'init_image') {
      if (updates[key] === "") {
        base[key] = "false";
      } else {
        base.use_unit = true;
        base.strength = 1.0;
        base.init_image = updates[key];
      }
    } else {
      base[key] = updates[key];
    }
  });
}

module.exports = mergeJson;
