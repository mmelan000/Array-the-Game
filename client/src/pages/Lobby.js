import React from 'react';
import { useEffect, useState } from 'react';
import Timer from '../components/Timer';
import DiceButton from '../components/DiceButton';
import Gamelog from '../components/Gamelog';
import TeamCardContainer from '../components/TeamCardContainer';
import Tile from '../components/Tile';
import ChatLog from '../components/ChatLog';
import { newBoard } from '../utils/newBoard';
// import onlyUnique from '../utils/onlyUnique';
import allClaimed from '../utils/allClaimed';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Endgame from '../utils/Endgame';
const { v4: uuidv4 } = require('uuid');

export default function Lobby({ room, socket, user }) {
  const [username, setUsername] = useState();
  // gamelog state
  const [log, setLog] = useState(['Game has begun.']);
  // current player state
  const [currentPlayer, setCurrentPlayer] = useState({});
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

  // const isTurn = user === currentPlayer;

  const sendLog = (room, logMessage) => {
    socket.emit('sendLog', room, logMessage);
  };

  const claimTile = (position, currentPlayer) => {
    const diceSum = diceRoll1 + diceRoll2;

    let updatedBoard = {
      ...board,
      [position]: {
        ...board[position],
        player: currentPlayer.color,
      },
    };

    if (
      diceSum === 10 &&
      board[position].player !== 'unclaimed' &&
      board[position].player !== currentPlayer.color
    ) {
      updatedBoard = {
        ...board,
        [position]: {
          ...board[position],
          player: 'unclaimed',
        },
      };
      sendLog(
        room,
        `Player ${currentPlayer.player} has removed ${board[position].display}.`
      );
      endPlayerTurn(room, updatedBoard);
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

    // setBoard(updatedBoard);

    sendLog(
      room,
      `Player ${currentPlayer.player} has claimed a ${board[position].display}.`
    );
    if (diceSum === 12) {
      sendLog(
        room,
        `Player ${currentPlayer.player} gets another turn from rolling a 12!.`
      );
      setDiceRoll1(0);
      setDiceRoll2(0);
      socket.emit('initTwoOrTwelve', room, updatedBoard);

      return;
    }
    if (diceSum === 2) {
      sendLog(
        room,
        `Player ${currentPlayer.player} gets another turn from rolling a 2!.`
      );
      setDiceRoll1(0);
      setDiceRoll2(0);
      socket.emit('initTwoOrTwelve', room, updatedBoard);
      return;
    } else {
      endPlayerTurn(room, updatedBoard);
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

  const endPlayerTurn = (room, board) => {
    console.log(room);
    console.log(board);

    socket.emit('initEndTurn', room, board);
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
    sendLog(room, `${currentPlayer.player} has rolled a ${result}.`);

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

    const otherPlayersTiles = otherPlayers(currentPlayer.color).map((e) => {
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
      sendLog(
        room,
        `Player ${currentPlayer} has rolled a ${result}, but there are no available tiles to remove.`
      );
      endPlayerTurn(room);
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

  // timer effect
  useEffect(() => {
    if (!gameStarted) {
      return;
    }
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        sendLog(
          room,
          `${currentPlayer.player} ran out of time and lost their turn.`
        );
        endPlayerTurn(room, board);
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
      let prePlayerList = [playerOne, playerTwo, playerThree];
      if (prePlayerList[2] === undefined) {
        prePlayerList.pop();
      }
      if (prePlayerList[1] === undefined) {
        prePlayerList.pop();
      }
      console.log(prePlayerList);

      setPlayers(prePlayerList);
    });
  }, [socket, players]);
  // shared StartGame
  useEffect(() => {
    socket.on('startGame', (players) => {
      setCurrentPlayer(players.find((e) => e.isTurn === true));
      setPlayers(players);
      setShow(false);
      setGameStarted(true);
      setSeconds(60);
    });
  }, [socket]);
  // shared Turn State
  useEffect(() => {
    socket.on('endTurn', (board) => {
      // const tempPlayers = players;
      // console.log(tempPlayers);
      // console.log(tempPlayers.indexOf(currentPlayer));

      // setPlayers([...players, ]);

      if (players.indexOf(currentPlayer) < players.length - 1) {
        setCurrentPlayer(players[players.indexOf(currentPlayer) + 1]);
      } else {
        // players[0].isTurn = true;
        setCurrentPlayer(players[0]);
      }
      setDiceRoll1(0);
      setDiceRoll2(0);
      setSeconds(60);
      setBoard(board);
      if (Endgame(board)) {
        setGameStarted(false);
        setSeconds(null);
        socket.emit('initEndGame', room);
      }
    });
  });
  useEffect(() => {
    socket.on('setUsername', (username) => {
      setUsername(username);
    });
  });
  useEffect(() => {
    socket.on('endGame', () => {
      setShowEnd(true);
    });
  });
  useEffect(() => {
    socket.on('twoOrTwelve', (board) => {
      setBoard(board);
      setSeconds(60);
      setDiceRoll1(0);
      setDiceRoll2(0);
      if (Endgame(board)) {
        setGameStarted(false);
        setSeconds(null);
        socket.emit('initEndGame', room);
      }
    });
  });
  useEffect(() => {
    socket.on('logUpdate', (logMessage) => {
      setLog([logMessage, ...log]);
    });
  });
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
                {players.map((e) => (
                  <li key={uuidv4()}>{e.player}</li>
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
          <ChatLog room={room} socket={socket} user={user} />
        </div>
        <div className='timer-and-board'>
          <Timer seconds={seconds} />
          <div className='Gameboard'>
            <div className='Gameboard-header'>{mappedBoardState}</div>
          </div>
        </div>
        <div className='dice-and-player'>
          {username === currentPlayer.player ? (
            <DiceButton
              diceRoll1={diceRoll1}
              diceRoll2={diceRoll2}
              onClick={() => rollDice()}
            />
          ) : (
            <div></div>
          )}
          {players ? <TeamCardContainer players={players} /> : <div></div>}
        </div>
        <Modal show={showEnd} onHide={handleCloseEnd}>
          <>
            <Modal.Header closeButton>
              <Modal.Title>The winner is: {currentPlayer.player}</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
          </>
        </Modal>
      </div>
    </div>
  );
}
