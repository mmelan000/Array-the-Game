import TeamCard from './TeamCard';

export default function TeamCardContainer({ players, isTurn }) {
  let teamCards = [
    <TeamCard
      player={players.playerOne}
      color={players.playerOne.color}
      isTurn={isTurn}
      key='1'
    />,
    <TeamCard
      player={players.playerTwo}
      color={players.playerTwo.color}
      isTurn={isTurn}
      key='2'
    />,
  ];
  if (players.length === 3) {
    teamCards.push(
      <TeamCard
        player={players.playerThree}
        color={players.playerThree.color}
        isTurn={isTurn}
        key='3'
      />
    );
  }

  return <div className='team-card-container'>{teamCards}</div>;
}
