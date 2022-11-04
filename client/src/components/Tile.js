// import BoardTile from '../images/Board/Tile1-01.svg';
function Tile(props) {
  return (
    <div className='board-container'>
      <div className='game-tile'>
        <div id='inner' className='game-tile'>
          <p>{props.num}</p>
          {/* <img src={BoardTile} alt="Background Tile for GameBoard"></img> */}
        </div>
      </div>
    </div>
  );
}

export default Tile;
