import { TextureLoader, Cache } from 'three';
import GLBLoader from 'three-gltf-loader';

import palet_buffet from '../../../data/textures/3d/palet_buffet.png';

export default class Loader3D {
  constructor() {
    this.textureLoader = new TextureLoader();
    this.GLBLoader = new GLBLoader();

    this._count = 0;
  }

  load() {
    const objects = [
    ];

    const textures = [
      { name: 'palet_buffet', asset: palet_buffet }
    ];

    this._count = objects.length + textures.length;

    return new Promise((resolve, reject) => {
      if (this._count === 0)
        resolve(null);

      objects.forEach((obj, i) => {
        this.GLBLoader.load(obj.asset, (object3d) => {
          Cache.add(obj.name, object3d);
          this._count--;

          if (this._count === 0)
            resolve(null);
        });
      });

      textures.forEach((txt) => {
        const textureMain = this.textureLoader.load(txt.asset);
        textureMain.flipY = false;
        Cache.add(txt.name, textureMain);

        this._count--;

        if (this._count === 0)
          resolve(null);
      });
    });
  }
}