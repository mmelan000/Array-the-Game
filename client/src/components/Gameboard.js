// gameboard goes here
import Tile from './Tile';
import React, { useState } from 'react';
import Endgame from '../utils/Endgame';

const claimTile = (props, isTurn, currentPlayer, boardState) => {
  if (!isTurn) {
    return;
  }
};

export default function Gameboard() {
  const [board, setBoard] = useState({
    1: {
      player: 'unclaimed',
      display: '2',
    },
    2: {
      player: 'unclaimed',
      display: '3',
    },
    3: {
      player: 'unclaimed',
      display: '4',
    },
    4: {
      player: 'unclaimed',
      display: '5',
    },
    5: {
      player: 'unclaimed',
      display: '6',
    },
    6: {
      player: 'unclaimed',
      display: '2',
    },
    7: {
      player: 'unclaimed',
      display: '6',
    },
    8: {
      player: 'unclaimed',
      display: '7',
    },
    9: {
      player: 'unclaimed',
      display: '8',
    },
    10: {
      player: 'unclaimed',
      display: '9',
    },
    11: {
      player: 'unclaimed',
      display: '7',
    },
    12: {
      player: 'unclaimed',
      display: '3',
    },
    13: {
      player: 'unclaimed',
      display: '5',
    },
    14: {
      player: 'unclaimed',
      display: '9',
    },
    15: {
      player: 'unclaimed',
      display: '12',
    },
    16: {
      player: 'unclaimed',
      display: '12',
    },
    17: {
      player: 'unclaimed',
      display: '8',
    },
    18: {
      player: 'unclaimed',
      display: '4',
    },
    19: {
      player: 'unclaimed',
      display: '4',
    },
    20: {
      player: 'unclaimed',
      display: '8',
    },
    21: {
      player: 'unclaimed',
      display: '12',
    },
    22: {
      player: 'unclaimed',
      display: '12',
    },
    23: {
      player: 'unclaimed',
      display: '9',
    },
    24: {
      player: 'unclaimed',
      display: '5',
    },
    25: {
      player: 'unclaimed',
      display: '3',
    },
    26: {
      player: 'unclaimed',
      display: '7',
    },
    27: {
      player: 'unclaimed',
      display: '9',
    },
    28: {
      player: 'unclaimed',
      display: '8',
    },
    29: {
      player: 'unclaimed',
      display: '7',
    },
    30: {
      player: 'unclaimed',
      display: '6',
    },
    31: {
      player: 'unclaimed',
      display: '2',
    },
    32: {
      player: 'unclaimed',
      display: '6',
    },
    33: {
      player: 'unclaimed',
      display: '5',
    },
    34: {
      player: 'unclaimed',
      display: '4',
    },
    35: {
      player: 'unclaimed',
      display: '3',
    },
    36: {
      player: 'unclaimed',
      display: '2',
    },
  });

  const newBoard = board;
  newBoard.filter();

  const mappedBoardState = Object.keys(board).forEach((e) => {
    return <Tile tileInfo={e} key={e.position} />;
  });

  return (
    <div className='Gameboard'>
      <div className='Gameboard-header'>{mappedBoardState}</div>
    </div>
  );
}
