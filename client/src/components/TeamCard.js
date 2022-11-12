import redTile from '../images/Board/RedBoardTile.svg';
import blueTile from '../images/Board/BlueBoardTile.svg';
import greenTile from '../images/Board/GreenBoardTile.svg';

export default function TeamCard({ currentPlayer, player, color, isTurn }) {
  let emblem;
  let altText;
  switch (color) {
    default:
      console.log('Check teamcard.js');
      break;

    case 'Red':
      emblem = redTile;
      altText =
        'Sun with sun rays coming off of it and enclosed by a square red border';
      break;

    case 'Blue':
      emblem = blueTile;
      altText =
        'Blue circle with water droplets in the top left and bottom right and enclosed by a square blue border';
      break;

    case 'Green':
      emblem = greenTile;
      altText =
        'Green circle with leaves in the top left and bottom right and enclosed by a square green border';
      break;
  }
  return (
    <div className={player === currentPlayer ? 'is-turn' : ''}>
      <div className='team-card'>
        <img className='team-card-image' src={emblem} alt={altText}></img>
        <p className='team-card-text'>{player}</p>
      </div>
    </div>
  );
}
