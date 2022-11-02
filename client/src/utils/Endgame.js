const testboard = [
  {
    position: 1,
    player: 'unclaimed',
    display: '2',
  },
  {
    position: 2,
    player: 'unclaimed',
    display: '3',
  },
  {
    position: 3,
    player: 'unclaimed',
    display: '4',
  },
  {
    position: 4,
    player: 'unclaimed',
    display: '5',
  },
  {
    position: 5,
    player: 'unclaimed',
    display: '6',
  },
  {
    position: 6,
    player: 'unclaimed',
    display: '2',
  },
  {
    position: 7,
    player: 'unclaimed',
    display: '6',
  },
  {
    position: 8,
    player: 'unclaimed',
    display: '7',
  },
  {
    position: 9,
    player: 'unclaimed',
    display: '8',
  },
  {
    position: 10,
    player: 'unclaimed',
    display: '9',
  },
  {
    position: 11,
    player: 'unclaimed',
    display: '7',
  },
  {
    position: 12,
    player: 'unclaimed',
    display: '3',
  },
  {
    position: 13,
    player: 'unclaimed',
    display: '5',
  },
  {
    position: 14,
    player: 'unclaimed',
    display: '9',
  },
  {
    position: 15,
    player: 'unclaimed',
    display: '12',
  },
  {
    position: 16,
    player: 'unclaimed',
    display: '12',
  },
  {
    position: 17,
    player: 'unclaimed',
    display: '8',
  },
  {
    position: 18,
    player: 'blue',
    display: '4',
  },
  {
    position: 19,
    player: 'blue',
    display: '4',
  },
  {
    position: 20,
    player: 'blue',
    display: '8',
  },
  {
    position: 21,
    player: 'unclaimed',
    display: '12',
  },
  {
    position: 22,
    player: 'unclaimed',
    display: '12',
  },
  {
    position: 23,
    player: 'blue',
    display: '9',
  },
  {
    position: 24,
    player: 'unclaimed',
    display: '5',
  },
  {
    position: 25,
    player: 'unclaimed',
    display: '3',
  },
  {
    position: 26,
    player: 'unclaimed',
    display: '7',
  },
  {
    position: 27,
    player: 'unclaimed',
    display: '9',
  },
  {
    position: 28,
    player: 'unclaimed',
    display: '8',
  },
  {
    position: 29,
    player: 'unclaimed',
    display: '7',
  },
  {
    position: 30,
    player: 'unclaimed',
    display: '6',
  },
  {
    position: 31,
    player: 'unclaimed',
    display: '2',
  },
  {
    position: 32,
    player: 'blue',
    display: '6',
  },
  {
    position: 33,
    player: 'yellow',
    display: '5',
  },
  {
    position: 34,
    player: 'red',
    display: '4',
  },
  {
    position: 35,
    player: 'red',
    display: '3',
  },
  {
    position: 36,
    player: 'unclaimed',
    display: '2',
  },
];
function victoryChecker(playerClaims) {
  // 16 different winning positions
  const winningPositions = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34, 35, 36],
    [1, 7, 13, 19, 25, 31],
    [2, 8, 14, 20, 26, 32],
    [3, 9, 15, 21, 27, 33],
    [4, 10, 16, 22, 28, 34],
    [5, 11, 17, 23, 29, 35],
    [6, 12, 18, 24, 30, 36],
    [1, 8, 15, 22, 29, 36],
    [6, 11, 16, 21, 26, 31],
  ];
  const toBeChecked = playerClaims;

  console.log('something');
}

function Endgame(boardState) {
  const redBoard = boardState
    .filter((a) => a.player === 'red')
    .map((b) => b.position);
  const yellowBoard = boardState
    .filter((a) => a.player === 'yellow')
    .map((b) => b.position);
  const blueBoard = boardState
    .filter((a) => a.player === 'blue')
    .map((b) => b.position);

  console.log(redBoard);
  console.log(yellowBoard);
  console.log(blueBoard);

  victoryChecker(blueBoard);
}

Endgame(testboard);
