import BoardTile from "../images/Board/Tile1-01.svg";
function Tile(props) {
  return (
    <div className="game-tile">
      <p>{props.num}</p>
      <img src={BoardTile} alt="Background Tile for GameBoard"></img>
    </div>
  );
}

export default Tile;
