import TeamCard from './TeamCard';

export default function TeamCardContainer({ players }) {
  const teamCards = players.map((e) => {
    // console.log(e.isTurn);
    return <TeamCard player={e.player} color={e.color} isTurn={e.isTurn} />;
  });

  return <div className='team-card-container'>{teamCards}</div>;
}
