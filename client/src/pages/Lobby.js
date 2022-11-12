import React from 'react';
import { useEffect, useState } from 'react';
import Timer from '../components/Timer';
import DiceButton from '../components/DiceButton';
import Gamelog from '../components/Gamelog';
import TeamCardContainer from '../components/TeamCardContainer';
import Tile from '../components/Tile';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

import ChatLog from '../components/ChatLog';
import { newBoard } from '../utils/newBoard';
// import onlyUnique from '../utils/onlyUnique';
import allClaimed from '../utils/allClaimed';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Endgame from '../utils/Endgame';
import fiveFive from '../images/dieRolls/fiveFive.json';
import fiveSix from '../images/dieRolls/fiveSix.json';
import fourFive from '../images/dieRolls/fourFive.json';
import fourFour from '../images/dieRolls/fourFour.json';
import fourSix from '../images/dieRolls/fourSix.json';
import oneFive from '../images/dieRolls/oneFive.json';
import oneFour from '../images/dieRolls/oneFour.json';
import oneOne from '../images/dieRolls/oneOne.json';
import oneSix from '../images/dieRolls/oneSix.json';
import oneThree from '../images/dieRolls/oneThree.json';
import oneTwo from '../images/dieRolls/oneTwo.json';
import sixSix from '../images/dieRolls/sixSix.json';
import threeFive from '../images/dieRolls/threeFive.json';
import threeFour from '../images/dieRolls/threeFour.json';
import threeSix from '../images/dieRolls/threeSix.json';
import threeThree from '../images/dieRolls/threeThree.json';
import twoFive from '../images/dieRolls/twoFive.json';
import twoFour from '../images/dieRolls/twoFour.json';
import twoSix from '../images/dieRolls/twoSix.json';
import twoThree from '../images/dieRolls/twoThree.json';
import twoTwo from '../images/dieRolls/twoTwo.json';
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
  const [diceState, setDiceState] = useState(false);
  const [diceAnimation, setDiceAnimation] = useState(fourFive);

  const sendLog = (room, logMessage) => {
    console.log(room, logMessage);
    socket.emit('sendLog', room, logMessage);
  };

  const claimTile = (position, currentPlayer) => {
    console.log(currentPlayer);
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
    renderDiceAnimation(dr1, dr2);
    setLog([`${currentPlayer.player} has rolled a ${result}.`, ...log]);

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
      endPlayerTurn(room, board);
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

      setPlayers(prePlayerList);
    });
  }, [socket, players]);
  // shared StartGame
  useEffect(() => {
    socket.on('startGame', (players) => {
      setPlayers(players);
      setCurrentPlayer(players.find((e) => e.isTurn === true));
      setShow(false);
      setGameStarted(true);
      setSeconds(60);
    });
  }, [socket]);
  // shared Turn State
  useEffect(() => {
    socket.on('endTurn', (board) => {
      console.log(currentPlayer);
      if (Endgame(board)) {
        setGameStarted(false);
        setSeconds(null);
        socket.emit('initEndGame', room);
      } else {
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
  const renderDiceAnimation = (dr1, dr2) => {
    let die1;
    let die2;

    if (dr1 > dr2) {
      die1 = dr2.toString();
      die2 = dr1.toString();
    } else if (dr1 < dr2) {
      die1 = dr1.toString();
      die2 = dr2.toString();
    }
    if (dr1 === dr2) {
      die1 = dr1.toString();
      die2 = dr2.toString();
    }

    const diceRolled = die1 + die2;
    switch (diceRolled) {
      case '55':
        setDiceAnimation(fiveFive);
        break;
      case '56':
        setDiceAnimation(fiveSix);
        break;
      case '45':
        setDiceAnimation(fourFive);
        break;
      case '44':
        setDiceAnimation(fourFour);
        break;
      case '46':
        setDiceAnimation(fourSix);
        break;
      case '15':
        setDiceAnimation(oneFive);
        break;
      case '14':
        setDiceAnimation(oneFour);
        break;
      case '11':
        setDiceAnimation(oneOne);
        break;
      case '16':
        setDiceAnimation(oneSix);
        break;
      case '13':
        setDiceAnimation(oneThree);
        break;
      case '12':
        setDiceAnimation(oneTwo);
        break;
      case '66':
        setDiceAnimation(sixSix);
        break;
      case '35':
        setDiceAnimation(threeFive);
        break;
      case '34':
        setDiceAnimation(threeFour);
        break;
      case '36':
        setDiceAnimation(threeSix);
        break;
      case '33':
        setDiceAnimation(threeThree);
        break;
      case '25':
        setDiceAnimation(twoFive);
        break;
      case '24':
        setDiceAnimation(twoFour);
        break;
      case '26':
        setDiceAnimation(twoSix);
        break;
      case '23':
        setDiceAnimation(twoThree);
        break;

      default:
        setDiceAnimation(twoTwo);
        break;
    }
    handleDiceShow();
  };

  const handleDiceShow = () => {
    setDiceState(true);
    setTimeout(handleDiceClose, 3000);
  };

  const handleDiceClose = () => {
    setDiceState(false);
  };
  // returned component
  return (
    <div>
      <div className='lobby-container'>
        <Modal show={show}>
          <>
            <Modal.Header>
              <Modal.Title>Start Game</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <h4>Players:</h4>
              <ul>
                {players.map((e) => (
                  <li key={uuidv4()}>{e.player}</li>
                ))}
              </ul>
              <h5>Lobby Link:</h5>
              <p>{window.location.href}</p>
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
          {players ? (
            <TeamCardContainer
              players={players}
              currentPlayer={currentPlayer.player}
            />
          ) : (
            <div></div>
          )}
        </div>

        <Modal show={showEnd}>
          <>
            <Modal.Header>
              <Modal.Title>The winner is: {currentPlayer.player}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button
                onClick={() => {
                  window.location.href = uuidv4();
                }}
              >
                Replay
              </Button>
              <Button href='/'>Close Game</Button>
            </Modal.Body>
          </>
        </Modal>
        <Modal show={diceState} contentClassName='dice-modal'>
          <>
            {/* <Modal.Header>
              <Modal.Title>You rolled a:</Modal.Title>
            </Modal.Header> */}
            <Modal.Body className='dice-roll-body'>
              <Player autoplay keepLastFrame src={diceAnimation}>
                <Controls visible={false} />
              </Player>
            </Modal.Body>
          </>
        </Modal>
      </div>
    </div>
  );
}
