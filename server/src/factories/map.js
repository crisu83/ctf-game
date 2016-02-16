import shortid from 'shortid';
import { forEach } from 'lodash';
import { addEntity } from '../actions/game';
import { createProps } from '../factories/props';

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

  forEach(json.layers, layer => {
    if (layer.type === LAYER_OBJECTS) {
      forEach(layer.objects, object => {
        let props = createProps({
          type: object.type,
          x: object.x,
          y: object.y,
          width: object.width,
          height: object.height
        });

        if (props) {
          dispatch(addEntity(props));
        }
      });
    }
  });

  return {
    id: shortid.generate(),
    key: key,
    image: map.image,
    music: map.music,
    collision: map.collision,
    data: json,
    layers: json.layers,
    width: json.width * json.tilesets[0].tilewidth,
    height: json.height * json.tilesets[0].tileheight
  };
}
