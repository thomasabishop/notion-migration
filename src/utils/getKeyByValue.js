/**
 *
 * @param {Object} obj Object to be parsed
 * @param {string} val Value to look up
 * @returns Array of keys for the object matching specified value
 */
exports.getKeyByValue = (obj, val) =>
  Object.keys(obj).filter((key) => obj[key] === val)
