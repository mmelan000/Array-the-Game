import React from 'react';
import { useEffect, useState } from 'react';
import Timer from '../components/Timer';
import DiceButton from '../components/DiceButton';
import Gamelog from '../components/Gamelog';
import TeamCardContainer from '../components/TeamCardContainer';
import Tile from '../components/Tile';
import ChatLog from '../components/ChatLog';
import { newBoard } from '../utils/newBoard';
const { v4: uuidv4 } = require('uuid');
// import onlyUnique from '../utils/onlyUnique';
import allClaimed from '../utils/allClaimed';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Endgame from '../utils/Endgame';

export default function Lobby({ room, socket, user }) {
  // gamelog state
  const [log, setLog] = useState(['Game has begun.']);
  // current player state
  const [currentPlayer, setCurrentPlayer] = useState('Red');
  // dice state
  const [diceRoll1, setDiceRoll1] = useState(0);
  const [diceRoll2, setDiceRoll2] = useState(0);
  // state for is game started
  const [gameStarted, setGameStarted] = useState(false);
  // boardState
  const [board, setBoard] = useState(newBoard);
  // time state
  const [seconds, setSeconds] = useState(null);
  // players
  const [players, setPlayers] = useState([]);

  const claimTile = (position, name) => {
    const diceSum = diceRoll1 + diceRoll2;

    let updatedBoard = {
      ...board,
      [position]: {
        ...board[position],
        player: name,
      },
    };

    if (
      diceSum === 10 &&
      board[position].player !== 'unclaimed' &&
      board[position].player !== name
    ) {
      updatedBoard = {
        ...board,
        [position]: {
          ...board[position],
          player: 'unclaimed',
        },
      };
      setBoard(updatedBoard);
      setLog([
        `Player ${currentPlayer} has removed ${board[position].display}.`,
        ...log,
      ]);
      endPlayerTurn();
      return;
    }

    if (
      board[position].player !== 'unclaimed' &&
      allClaimed(board[position].display, board) === false
    ) {
      console.log('Tile already claimed.');
      return;
    }
    if (diceSum !== parseInt(board[position].display) && diceSum !== 11) {
      console.log('This isnt the number you rolled.');
      return;
    }

    setBoard(updatedBoard);
    gameOverChecker(updatedBoard);
    setLog([
      `Player ${currentPlayer} has claimed a ${board[position].display}.`,
      ...log,
    ]);
    if (diceSum === 12) {
      setLog([
        `Player ${currentPlayer} gets another turn from rolling a 12!.`,
        ...log,
      ]);
      setDiceRoll1(0);
      setDiceRoll2(0);
      return;
    }
    if (diceSum === 2) {
      setLog([
        `Player ${currentPlayer} gets another turn from rolling a 2!.`,
        ...log,
      ]);
      setDiceRoll1(0);
      setDiceRoll2(0);
      return;
    } else {
      endPlayerTurn();
      return;
    }
  };

  const mappedBoardState = Object.entries(board).map((e) => {
    return (
      <Tile
        tileDisplay={e[1].display}
        player={e[1].player.toLowerCase()}
        id={e[0]}
        key={e[0]}
        onClick={() => {
          claimTile(e[0], currentPlayer);
        }}
      />
    );
  });

  const endPlayerTurn = () => {
    setDiceRoll1(0);
    setDiceRoll2(0);
    if (currentPlayer === 'Red') {
      setCurrentPlayer('Green');
      setSeconds(60);
      return;
    }
    if (currentPlayer === 'Green') {
      setCurrentPlayer(() => {
        if (players.length === 3) {
          setCurrentPlayer('Blue');
        } else {
          setCurrentPlayer('Red');
        }
      });
      setSeconds(60);
      return;
    }
    if (currentPlayer === 'Blue') {
      setCurrentPlayer('Red');
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

    const otherPlayers = (currentPlayer) => {
      switch (currentPlayer) {
        case 'Green':
          return ['Blue', 'Red'];
        case 'Blue':
          return ['Green', 'Red'];
        default:
          return ['Blue', 'Green'];
      }
    };

    const otherPlayersTiles = otherPlayers(currentPlayer).map((e) => {
      const playerTiles = Object.entries(board).filter((f) => {
        if (f[1].player === e) {
          return true;
        } else {
          return false;
        }
      });
      return playerTiles;
    });

    if (
      otherPlayersTiles[0].length === 0 &&
      otherPlayersTiles[1].length === 0 &&
      result === 10
    ) {
      setLog([
        `Player ${currentPlayer} has rolled a ${result}, but there are no available tiles to remove.`,
        ...log,
      ]);
      endPlayerTurn();
    }
  };

  const startGame = () => {
    socket.emit('startGameInit', players, room);
  };
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
  };

  const [showEnd, setShowEnd] = useState(false);
  const handleCloseEnd = () => {
    setShowEnd(false);
  };

  const gameOverChecker = (currentBoard) => {
    if (Endgame(currentBoard)) {
      setShowEnd(true);
    }
  };

  // timer effect
  useEffect(() => {
    if (!gameStarted) {
      return;
    }
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
  // SOCKET IO STUFF
  // player list socketio
  useEffect(() => {
    socket.on('newPlayer', ({ playerOne, playerTwo, playerThree }) => {
      setPlayers([playerOne, playerTwo, playerThree]);
      console.log(players);
    });
  }, [socket, players]);
  // shared StartGame
  useEffect(() => {
    socket.on('startGame', (players) => {
      console.log(players);
      let playerList = [
        { playerOne: players[0], team: 'Red' },
        { playerTwo: players[1], team: 'Green' },
      ];
      if (players[2]) {
        playerList.push({ playerThree: players[2], team: 'Blue' });
      }
      setPlayers(players);
      setShow(false);
      setGameStarted(true);
    });
  }, [socket]);

  // returned component
  return (
    <div>
      <div className='lobby-container'>
        <Modal show={show}>
          <>
            <Modal.Header>
              <Modal.Title>Start Game </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Players:
              <ul>
                {players.map((player) => (
                  <li key={uuidv4()}>{player}</li>
                ))}
              </ul>
            </Modal.Body>
          </>
          <div className='start-game-modal'>
            <Button
              variant='primary'
              type='submit'
              onClick={() => {
                handleClose();
                startGame();
              }}
            >
              Start Game
            </Button>
            <Button
              variant='primary'
              type='submit'
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Close
            </Button>
          </div>
        </Modal>

        <div className='log-and-chat'>
          <Gamelog log={log} />
          {/* chat */}
          <ChatLog room={room} socket={socket} user={user} />
        </div>
        <div className='timer-and-board'>
          <Timer seconds={seconds} />
          <div className='Gameboard'>
            <div className='Gameboard-header'>{mappedBoardState}</div>
          </div>
          {/* if currentPlayer === user */}
        </div>
        <div className='dice-and-player'>
          <DiceButton
            diceRoll1={diceRoll1}
            diceRoll2={diceRoll2}
            onClick={() => rollDice()}
          />
          <TeamCardContainer players={players} isCurrentTurn={true} />
        </div>
        {/* if/ */}
        {/* if endGame === true */}
        {/* <endGameCard winner={winner}/> */}
        {/* if/ */}
        <Modal show={showEnd} onHide={handleCloseEnd}>
          <>
            <Modal.Header closeButton>
              <Modal.Title>The winner is:</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
          </>
        </Modal>
      </div>
    </div>
  );
}
