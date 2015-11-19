import Rx from 'rx';
import {h} from '@cycle/dom';

function model({word$, guesses$}) {
  return Rx.Observable.combineLatest(word$, guesses$,
    (word, guesses) => {
      return {word, guesses}
    }
  );
}

function view(state$) {
  return state$.map(({word, guesses}) => {
    return h('div.letter-slots', word.split('').map(char => {
      let text = guesses.has(char) ? char : ' ';
      return h('span.letter-slot', text);
    }));
  });
}

function letter_slots({DOM, word$, guesses$}) {

  return {
    DOM: view(model({word$, guesses$}))
  };

}

export default letter_slots;
