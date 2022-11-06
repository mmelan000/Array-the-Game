import React from 'react';
import { useEffect, useState } from 'react';
// import Gameboard from '../components/Gameboard';
import Timer from '../components/Timer';
// import Endgame from '../utils/Endgame';
import DiceButton from '../components/DiceButton';
import Gamelog from '../components/Gamelog';
import TeamCardContainer from '../components/TeamCardContainer';
import Tile from '../components/Tile';

export default function Lobby() {
  // gamelog state
  const [log, setLog] = useState(['Game has begun.']);
  // current player state
  const [currentPlayer, setCurrentPlayer] = useState(1);
  // dice state
  const [diceRoll1, setDiceRoll1] = useState(0);
  const [diceRoll2, setDiceRoll2] = useState(0);
  // time state
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        setLog([
          `Player ${currentPlayer} ran out of time and lost their turn.`,
          ...log,
        ]);
        endPlayerTurn();
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });
  // boardState
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

  const claimTile = (position, name) => {
    console.log({ position, name });
    if (board[position].player !== 'unclaimed') {
      console.log('Tile already claimed.');
      return;
    }
    if (diceRoll1 + diceRoll2 !== parseInt(board[position].display)) {
      console.log('This isnt the number you rolled.');
      return;
    }
    let claimerName = name;
    if (claimerName === 1) {
      claimerName = 'red';
    }
    if (claimerName === 2) {
      claimerName = 'green';
    }
    if (claimerName === 3) {
      claimerName = 'blue';
    }
    const newBoard = {
      ...board,
      [position]: {
        ...board[position],
        player: claimerName,
      },
    };
    console.log(newBoard);
    setBoard(newBoard);
    setDiceRoll1(0);
    setDiceRoll2(0);
    setLog([
      `Player ${currentPlayer} has claimed a ${board[position].display}.`,
      ...log,
    ]);
    endPlayerTurn();
  };

  const mappedBoardState = Object.entries(board).map((e) => {
    return (
      <Tile
        tileDisplay={e[1].display}
        player={e[1].player}
        id={e[0]}
        key={e[0]}
        onClick={() => {
          claimTile(e[0], currentPlayer);
        }}
      />
    );
  });
  // currentPlayer

  // teams
  let teams = 3;

  const endPlayerTurn = () => {
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
      setSeconds(60);
      return;
    }
    if (currentPlayer === 2) {
      setCurrentPlayer(() => {
        if (teams === 3) {
          setCurrentPlayer(3);
        } else {
          setCurrentPlayer(1);
        }
      });
      setSeconds(60);
      return;
    }
    if (currentPlayer === 3) {
      setCurrentPlayer(1);
      setSeconds(60);
      return;
    }
  };

  const rollDice = () => {
    if (diceRoll1 !== 0) {
      console.log('You already rolled.');
      return;
    }
    const dr1 = Math.floor(Math.random() * 6 + 1);
    const dr2 = Math.floor(Math.random() * 6 + 1);
    setDiceRoll1(dr1);
    setDiceRoll2(dr2);
    const result = dr1 + dr2;
    setLog([`Player ${currentPlayer} has rolled a ${result}.`, ...log]);
  };

  return (
    <div>
      <Timer seconds={seconds} />
      <Gamelog log={log} />
      {/* chat */}
      <TeamCardContainer teams={teams} />
      <div className='Gameboard'>
        <div className='Gameboard-header'>{mappedBoardState}</div>
      </div>

      <DiceButton
        diceRoll1={diceRoll1}
        diceRoll2={diceRoll2}
        onClick={() => rollDice()}
      />
    </div>
  );
}
