import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  var newGame$ = DOM
    .select('.new-game')
    .events('click')
    .map(e => true)
    .startWith(true);

  return {
    newGame$
  }
}

function view(gameOn$) {
  return gameOn$.map(gameOn => {
    let classes = ['new-game'];
    if (!gameOn) {
      classes.push('shown');
    }
    return h('button', 
      {disabled: gameOn, className: classes.join(' ')}, 
    'New Game');
  })
}

export default function({DOM, gameOn$}) {

  let actions = intent(DOM);
  let vtree$ = view(gameOn$);
  let {newGame$} = actions;

  return {
    DOM: vtree$,
    newGame$
  };

}
