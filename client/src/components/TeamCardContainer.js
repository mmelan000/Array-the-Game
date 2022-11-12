import TeamCard from './TeamCard';
const { v4: uuidv4 } = require('uuid');

export default function TeamCardContainer({ players, currentPlayer }) {
  const teamCards = players.map((e) => {
    return (
      <TeamCard
        currentPlayer={currentPlayer}
        player={e.player}
        color={e.color}
        isTurn={e.isTurn}
        key={uuidv4()}
      />
    );
  });

  return <div className='team-card-container'>{teamCards}</div>;
}
