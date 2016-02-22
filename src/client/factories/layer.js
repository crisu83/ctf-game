/**
 *
 * @param {Phaser.Tilemap} map
 * @param {Object} props
 * @returns {Phaser.TilemapLayer}
 */
function createWalls(map, props) {
  const layer = map.createLayer(props.name);

  map.setCollision([41], true, layer);

  return layer;
}

/**
 *
 * @param {Phaser.Tilemap} map
 * @param {Object} props
 * @returns {Phaser.TilemapLayer}
 */
export function createLayer(map, props) {
  let layer;

  switch (props.name) {
    case 'Walls':
      layer = createWalls(map, props);
      break;

    default:
      layer = map.createLayer(props.name);
  }

  if (layer) {
    layer.resizeWorld();
  }

  return layer;
}
