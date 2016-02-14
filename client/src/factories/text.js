/**
 *
 * @param {Phaser.Game} game
 * @param {Object} props
 * @returns {Phaser.Text}
 */
export function createName(game, props) {
  const style = {font: "14px Courier", stroke: "#000", strokeThickness: 5, fill: '#FFF'};
  const text = game.add.text(0, 0, props.name, style);
  text.anchor.set(0.5, 0.5);
  return text;
}
