module.exports.info = function info(text) {
  console.log("INFO: ", text);
  return text;
};

module.exports.error = function error(text) {
  console.log("ERROR: ", text);
  return text;
};

/* 
     exportacion global
module.exports = { info, error };

      exportacion parcial
module.exports.info = info;
module.exports.error = error;
 */
