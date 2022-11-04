// gameboard goes here
import Tile from './Tile';
import React from 'react';
import Endgame from '../utils/Endgame';

const claimTile = (props, isTurn, currentPlayer, boardState) => {
  if (!isTurn) {
    return;
  }
};

export default function Gameboard(props) {
  const mappedBoardState = Object.entries(props.board).map((e) => {
    return <Tile tileDisplay={e[1].display} key={e[1].position} />;
  });

  return (
    <div className='Gameboard'>
      <div className='Gameboard-header'>{mappedBoardState}</div>
    </div>
  );
}
