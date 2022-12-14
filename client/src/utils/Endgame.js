function victoryChecker(playerClaims) {
  // 16 different winning positions
  const winningPositions = [
    ['1', '2', '3', '4', '5', '6'],
    ['7', '8', '9', '10', '11', '12'],
    ['13', '14', '15', '16', '17', '18'],
    ['19', '20', '21', '22', '23', '24'],
    ['25', '26', '27', '28', '29', '30'],
    ['31', '32', '33', '34', '35', '36'],
    ['1', '7', '13', '19', '25', '31'],
    ['2', '8', '14', '20', '26', '32'],
    ['3', '9', '15', '21', '27', '33'],
    ['4', '10', '16', '22', '28', '34'],
    ['5', '11', '17', '23', '29', '35'],
    ['6', '12', '18', '24', '30', '36'],
    ['1', '8', '15', '22', '29', '36'],
    ['6', '11', '16', '21', '26', '31'],
  ];

  const result = winningPositions.every((e) => {
    const testTable = e;
    let confirmTable = [];

    for (let i = 0; i < testTable.length; i++) {
      if (playerClaims.includes(testTable[i])) {
        confirmTable.push(testTable[i]);
      }
    }

    if (confirmTable.length !== 6) {
      return true;
    } else {
      console.log('Victory Condition Found', confirmTable);
      return false;
    }
  });

  return result;
}

export default function Endgame(boardState) {
  const red = [];
  const blue = [];
  const green = [];
  for (const [key, value] of Object.entries(boardState)) {
    if (value.player === 'Red') {
      red.push(key);
    }
    if (value.player === 'Green') {
      blue.push(key);
    }
    if (value.player === 'Blue') {
      green.push(key);
    }
  }

  if (!victoryChecker(blue)) {
    console.log('Blue Wins');
    return true;
  }
  if (!victoryChecker(red)) {
    console.log('Red Wins');
    return true;
  }
  if (!victoryChecker(green)) {
    console.log('Yellow Wins');
    return true;
  }
  return false;
}
