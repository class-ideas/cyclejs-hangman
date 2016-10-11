import xs from 'xstream';
import {h} from '@cycle/dom';

function intent(DOM) {
  return {
    newGame$: DOM
      .select('.new-game')
      .events('click')
      .mapTo(true)
  }
}

function view() {
  return xs.of(
    h('button.new-game.shown', 'New Game')
  );
}

export default function({DOM}) {
  let {newGame$} = intent(DOM);
  let vtree$ = view();

  return {
    DOM: vtree$,
    newGame$
  };
}
