export default function Gamelog(props) {
  console.log('Gamelog.js');
  console.log(props);
  const logs = props.log.map((e) => {
    return <li>{e}</li>;
  });
  return <ul className='game-log'>{logs}</ul>;
}
