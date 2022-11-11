export default function allClaimed(display, board) {
  const checker = Object.entries(board).filter((e) => {
    if (e[1].display === display && e[1].player !== 'unclaimed') {
      return true;
    } else {
      return false;
    }
  });

  if (checker.length === 4) {
    return true;
  } else {
    return false;
  }
}
