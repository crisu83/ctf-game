import shortid from 'shortid';
import { forEach } from 'lodash';
import { DATA_PATH, LAYER_OBJECTS } from '../constants';

/**
 *
 * @param {string} key
 * @returns {Object}
 */
export function createMap(key) {
  const mapsData = require(`${DATA_PATH}/maps.json`);

  if (!mapsData[key]) {
    throw new Error('Failed to load data for unknown map.');
  }

  const mapData = mapsData[key];
  const json = require(`${DATA_PATH}/${mapData.src}`);

  if (!json) {
    throw new Error('Failed to load unknown map.');
  }
  
  const objects = [];

  forEach(json.layers, layer => {
    if (layer.type === LAYER_OBJECTS) {
      forEach(layer.objects, object => {
        objects.push(object);
      });
    }
  });

  return {
    id: shortid.generate(),
    key: key,
    image: mapData.image,
    music: mapData.music,
    data: json,
    layers: json.layers,
    width: json.width * json.tilesets[0].tilewidth,
    height: json.height * json.tilesets[0].tileheight,
    tileWidth: json.tilesets[0].tilewidth,
    tileHeight: json.tilesets[0].tileheight,
    objects: objects
  };
}
