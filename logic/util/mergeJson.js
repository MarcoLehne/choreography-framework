function mergeJson(base, updates) {
  Object.keys(updates).forEach(key => {
    base[key] = updates[key]; // Overwrite the value
  });
}

module.exports = mergeJson;