function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

module.exports = { timeout, clone };
