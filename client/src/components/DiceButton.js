import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import D1 from '../images/dieRolls/D1.png';
import D2 from '../images/dieRolls/D2.png';
import D3 from '../images/dieRolls/D3.png';
import D4 from '../images/dieRolls/D4.png';
import D5 from '../images/dieRolls/D5.png';
import D6 from '../images/dieRolls/D6.png';

export default function DiceButton({ diceRoll1, diceRoll2, onClick }) {
  // console.log('DiceButton.js');
  let dr1, dr2;

  switch (diceRoll1) {
    default:
      dr1 = D1;
      break;
    case 2:
      dr1 = D2;
      break;
    case 3:
      dr1 = D3;
      break;
    case 4:
      dr1 = D4;
      break;
    case 5:
      dr1 = D5;
      break;
    case 6:
      dr1 = D6;
      break;
  }

  switch (diceRoll2) {
    default:
      dr2 = D1;
      break;
    case 2:
      dr2 = D2;
      break;
    case 3:
      dr2 = D3;
      break;
    case 4:
      dr2 = D4;
      break;
    case 5:
      dr2 = D5;
      break;
    case 6:
      dr2 = D6;
      break;
  }

  if (diceRoll1 !== 0) {
    return (
      <div className='dice-roller'>
        <Button variant='success' onClick={onClick}>
          Roll Dice
        </Button>
        <div className='static-dice-container'>
          <img className='static-dice' src={dr1} alt='dice' />{' '}
          <img className='static-dice' src={dr2} alt='dice' />
        </div>
      </div>
    );
  } else {
    return (
      <div variant='success' className='dice-roller'>
        <Button onClick={onClick}>Roll Dice</Button>
      </div>
    );
  }
}
