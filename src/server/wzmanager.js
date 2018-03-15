'use strict';

/**
 * Module dependencies.
 * @private
 */
const fs = require('fs');
const path = require('path');
const WZNode = require('./wznode').WZNode;

/**
 * Module exports.
 * @public
 */
module.exports = {
  load,
  get,
};

const cache = new WZNode({ '$dir': '' });

/**
 * Loads server WZ files.
 * @param {string} wzDir - Root directory of server WZ files.
 * @public
 */
function load(wzDir) {
  const now = Date.now();
  loadRecursive(wzDir);
  console.log(`Done loading WZ files. Took ${Date.now() - now} ms.`);
}

/**
 * Gets object from the cache.
 * @param {string} thePath - Path to object.
 * @return {object} Object defined by thePath.
 * @example get('Map.wz/Map/Map1/100000000.img') => Henesys map
 * @example get('Map.wz/Map/Map1/100000000.img/info') => Henesys metadata
 * @public
 */
function get(thePath) {
  let tree = cache;
  thePath.split('/').forEach(p => {
    tree = tree[p];
  });
  return tree;
}

/**
 * Recursively loads server WZ files.
 * @param {string} dir - The directory.
 * @private
 */
function loadRecursive(dir) {
  if (fs.statSync(dir).isDirectory()) {
    fs.readdirSync(dir).forEach(subDir => {
      loadRecursive(path.join(dir, subDir));
    });
  } else {
    loadFile(dir);
  }
}

/**
 * Loads a single WZ file.
 * @param {string} filename - Path to file.
 * @private
 */
function loadFile(filename) {
  const normalizedFilename = normalizeFilename(filename);
  const json = fs.readFileSync(filename, 'utf8');
  
  let tree = cache;
  normalizedFilename.split('/').slice(0, -1).forEach(p => {
    if (!(p in tree)) {
      tree[p] = new WZNode({ '$dir': p }, tree);
      tree.nChildren.push(tree[p]);
    }
    tree = tree[p];
  });

  const subtree = new WZNode(JSON.parse(json), tree);
  tree[subtree.nName] = subtree;
  tree.nChildren.push(subtree);
  console.log(normalizedFilename);
}

/**
 * Normalizes a filename.
 * @param {string} filename - Path to file.
 * @return {string} Normalized filename.
 * @example normalizeFilename('x/y/UI.wz/Logo.img.json') => 'UI.wz/Logo.img'
 * @example normalizeFilename('x/Map.wz/Obj/y.img.json') => 'Map.wz/Obj/y.img'
 * @private
 */
function normalizeFilename(filename) {
  const [wzPart, rest] = filename.split('.wz');
  const wzDir = wzPart.split('/').pop();
  const noFiletype = rest.replace('.json', '');
  return [wzDir, '.wz', noFiletype].join('');
}
