import UnclaimedBoardTile from '../images/Board/UnclaimedBoardTile.svg';
import RedBoardTile from '../images/Board/RedBoardTile.svg';
import BlueBoardTile from '../images/Board/BlueBoardTile.svg';
import GreenBoardTile from '../images/Board/GreenBoardTile.svg';

function Tile(props) {
  let background;
  if (props.player === 'unclaimed') {
    background = UnclaimedBoardTile;
  }
  if (props.player === 'red') {
    background = RedBoardTile;
  }
  if (props.player === 'green') {
    background = GreenBoardTile;
  }
  if (props.player === 'blue') {
    background = BlueBoardTile;
  }

  // console.log('Tile.js');
  return (
    <div className={'game-tile '} id={props.id} onClick={props.onClick}>
      <p>{props.tileDisplay}</p>
      <img src={background} alt='Background Tile for GameBoard'></img>
    </div>
  );
}

export default Tile;
