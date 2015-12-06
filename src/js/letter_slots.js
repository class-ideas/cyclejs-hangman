import Rx from 'rx';
import {h} from '@cycle/dom';

function model({word$, guesses$, gameOn$}) {
  return Rx.Observable.combineLatest(word$, guesses$, gameOn$,
    (word, guesses, gameOn) => {
      return {word, guesses, gameOn}
    }
  );
}

function view(state$) {
  return state$.map(({word, guesses, gameOn}) => {
    return h('div.letter-slots', word.split('').map(char => {
      let classNames = ['letter-slot'];
      let text = guesses.has(char) ? char : ' ';
      if (text === ' ' && !gameOn) {
        classNames.push('revealed');
        text = char;
      }
      return h('span', {className: classNames.join(' ')}, text);
    }));
  });
}

function letter_slots({word$, guesses$, gameOn$}) {
  return {
    DOM: view(model({word$, guesses$, gameOn$}))
  };
}

export default letter_slots;
