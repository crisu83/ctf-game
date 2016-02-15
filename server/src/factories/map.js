import shortid from 'shortid';
import { forEach } from 'lodash';
import { addEntity } from '../actions/game';
import { createEntity } from '../factories/entity';

const LAYER_TILES = 'tilelayer';
const LAYER_OBJECTS = 'objectgroup';

/**
 *
 * @param {string} key
 * @param {function} dispatch
 */
export function createMap(key, dispatch) {
  const maps = require('../../data/maps.json');

  // TODO: Ensure that the map config was found.

  const map = maps[key];
  const json = require(`../../data/${map.src}`);

  // TODO: Ensure that the request map was found.

  const tileLayers = json.layers.filter(layer => layer.type === LAYER_TILES);
  const objectLayers = json.layers.filter(layer => layer.type === LAYER_OBJECTS);

  forEach(objectLayers, layer => {
    forEach(layer.objects, object => {
      let entity = createEntity({
        type: object.type,
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height
      });

      if (entity) {
        dispatch(addEntity(entity));
      }
    });
  });

  return {
    id: shortid.generate(),
    key: key,
    image: map.image,
    music: map.music,
    data: json,
    layers: tileLayers,
    width: json.width * json.tilesets[0].tilewidth,
    height: json.height * json.tilesets[0].tileheight
  };
}
