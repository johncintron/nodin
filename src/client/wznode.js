import BASE64_HEADERS from './base64headers';

class WZNode {
  constructor(obj, nParent=null) {
    this.nParent = nParent;
    this.nChildren = [];

    const isTag = key => key !== '$$' && key.charAt(0) === '$';
    const $tagName = Object.keys(obj).find(isTag);
    this.nTagName = $tagName.substr(1);
    this.nName = obj[$tagName];

    Object.entries(obj).forEach(([key, value]) => {
      /**
       * nKey is used because we want to prevent name collision.
       *
       * Consider the following node:
       *
       * <imgdir name="9100117">
       *   <string name="name" value="Gachapon />
       * </imgdir>
       *
       * node.name is a collision because it could refer to "9100117" or
       * the child.
       *
       * In general, for any given wzNode, it is possible that the node
       * has a key X and one of its children is such that child.name = X.
       * nKey ensures that any particular key references an unambiguous
       * object.
       *
       * Now consider the node using nKey:
       *
       * <imgdir nName="9100117">
       *   <string nName="name" nValue="Gachapon" />
       * </imgdir>
       *
       * node.nName => "9100117"
       * node.name => A reference to the child.
       *
       * The nKey itself has no collision because there does not exist a node
       * and a key in the WZ files such that node.key = n[A-Z]
       */
      if (key.charAt(0) !== '$') {
        const nKey = `n${key.charAt(0).toUpperCase()}${key.substr(1)}`;
        this[nKey] = isNaN(value) ? value : parseFloat(value);
      }
    });

    if (!!obj.$$) {
      obj.$$.forEach(childObj => {
        const child = new WZNode(childObj, this);
        this[child.nName] = child;
        this.nChildren.push(child);
      });
    }
  }
  nGet(key, defaultValue=new WZNode({ '$imgdir': '' })) {
    return (key in this) ? this[key] : defaultValue;
  }
  nGetChild(childCallback) {
    for (const child of this.nChildren) {
      if (!!childCallback(child)) {
        return child;
      }
    }
    return null;
  }
  nResolveUOL() {
    if (this.nTagName === 'uol') {
      let ret = `${this.nValue}`.split('/').reduce((pointer, pathName) => {
        return pathName === '..' ? pointer.nParent : pointer[pathName];
      }, this.nParent);

      while (ret.nTagName === 'uol') {
        ret = ret.nResolveUOL();
      }

      return ret;
    }
  }
  nGetPath() {
    let ret = '';
    let pointer = this;
    while (!!pointer) {
      ret = `${pointer.nName}/${ret}`;
      pointer = pointer.nParent;
    }
    return ret.slice(1, -1);
  }
  nGetAudio() {
    if (this.nBasedata.constructor === String) {
      this.nBasedata = new Audio(`${BASE64_HEADERS.MP3}${this.nBasedata}`);
    }
    return this.nBasedata;
  }
  nGetImage() {
    if (this.nBasedata.constructor === String) {
      const img = new Image();
      img.src = `${BASE64_HEADERS.PNG}${this.nBasedata}`;
      this.nBasedata = img;
    }
    return this.nBasedata;
  }
}

export default WZNode;
