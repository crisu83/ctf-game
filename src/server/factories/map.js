import shortid from 'shortid';
import { forEach } from 'lodash';
import { addEntity } from '../actions/game';
import { createProps } from '../factories/props';
import { DATA_PATH, LAYER_OBJECTS } from '../constants';

const mapsData = require(`${DATA_PATH}/maps.json`);

/**
 *
 * @param {string} key
 * @param {function} dispatch
 */
export function createMap(key, dispatch) {

  if (!mapsData[key]) {
    throw new Error('Failed to load data for unknown map.');
  }

  const mapData = mapsData[key];

  const json = require(`${DATA_PATH}/${mapData.src}`);

  if (!json) {
    throw new Error('Failed to load unknown map.');
  }

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
    image: mapData.image,
    music: mapData.music,
    collision: mapData.collision,
    data: json,
    layers: json.layers,
    width: json.width * json.tilesets[0].tilewidth,
    height: json.height * json.tilesets[0].tileheight
  };
}
