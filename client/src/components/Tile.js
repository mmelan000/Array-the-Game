import BoardTile from '../images/Board/Tile1-01.svg';

function Tile(props) {
  // console.log('Tile.js');
  return (
    <button className={'game-tile ' + props.player} id={props.id}>
      <p>{props.tileDisplay}</p>
      <img src={BoardTile} alt='Background Tile for GameBoard'></img>
    </button>
  );
}

export default Tile;
