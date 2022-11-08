export default function Gamelog(props) {
  //   console.log('Gamelog.js');
  const logs = props.log.map((e) => {
    return <li key={props.log.indexOf(e)}>{e}</li>;
  });
  return (
    <div className='game-log-container'>
      <header className='game-log-header'>Game Log</header>
      <ul className='game-log'>{logs}</ul>
    </div>
  );
}
