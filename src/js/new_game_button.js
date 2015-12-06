import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  return {
    newGame$: DOM
      .select('.new-game')
      .events('click')
      .map(e => true)
  }
}

function view() {
  return Rx.Observable.just(
    h('button.new-game.shown', 'New Game')
  );
}

export default function({DOM}) {
  let actions = intent(DOM);
  let vtree$ = view();
  let {newGame$} = actions;

  return {
    DOM: vtree$,
    newGame$
  };
}
