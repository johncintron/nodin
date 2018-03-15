/**
 * Loads remote JSON.
 *
 * @param {string} filename - Path to remote JSON file.
 * @return {Promise} Resolve JSON when done loading.
 */
function LOAD_JSON(filename) {
  return fetch(filename).then(res => res.json());
}

export default LOAD_JSON;
