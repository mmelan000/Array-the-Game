import BoardTile from '../images/Board/Tile1-01.svg';

function Tile(props) {
  // console.log('Tile.js');
  return (
    <div
      className={'game-tile ' + props.player}
      id={props.id}
      onClick={props.onClick}
    >
      <p>{props.tileDisplay}</p>
      <img src={BoardTile} alt='Background Tile for GameBoard'></img>
    </div>
  );
}

export default Tile;
