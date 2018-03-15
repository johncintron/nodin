import LOAD_JSON from './loadjson';
import WZNode from './wznode';

const WZManager = {};

WZManager.initialize = function() {
  this.cache = new WZNode({ '$dir': '' });
};

/**
 * Loads and caches a WZ file.
 *
 * @private
 * @param {string} filename - Relative path to WZ file.
 * @example WZManager.load('Map.wz/Map/Map1/100000000.img');
 * @example WZManager.load('Character.wz/Cap/01002357.img');
 */
WZManager.load = async function(filename) {
  const json = await LOAD_JSON(`wz_client/${filename}.json`);

  let tree = this.cache;
  filename.split('/').slice(0, -1).forEach(p => {
    if (!(p in tree)) {
      tree[p] = new WZNode({ '$dir': p }, tree);
      tree.nChildren.push(tree[p]);
    }
    tree = tree[p];
  });

  const subtree = new WZNode(json, tree);
  tree[subtree.nName] = subtree;
  tree.nChildren.push(subtree);
};

/**
 * Determines if a WZ path exists.
 *
 * A path is split by a slash and each element is compared against the cache.
 *
 * @private
 * @param {string} thePath - WZ path.
 * @return {Boolean} True if path exists, false otherwise.
 */
WZManager.pathExists = function(thePath) {
  let tree = this.cache;
  for (const p of thePath.split('/')) {
    if (tree === undefined || tree[p] === undefined) {
      return false;
    }
    tree = tree[p];
  }
  return true;
};

WZManager.get = async function(thePath) {
  if (!this.pathExists(thePath)) {
    const filename = `${thePath.split('.img')[0]}.img`;
    await this.load(filename);
  }
  let tree = this.cache;
  thePath.split('/').forEach(p => {
    tree = tree[p];
  });
  return tree;
};

export default WZManager;
