import Rx from 'rx';
import {h} from '@cycle/dom';

function model({word$, guesses$, gameOver$}) {
  return Rx.Observable.combineLatest(
    word$, guesses$, gameOver$,
    (word, guesses, gameOver) => {
      return {word, guesses, gameOver}
    }
  );
}

function view(state$) {
  return state$.map(({word, guesses, gameOver}) => {
    return h('div.letter-slots', word.split('').map(char => {
      let classNames = ['letter-slot'];
      let text = guesses.has(char) ? char : ' ';
      if (text === ' ' && gameOver) {
        classNames.push('revealed');
        text = char;
      }
      let className = classNames.join(' ');
      return h('span', {className}, text);
    }));
  });
}

function letter_slots(streams) {
  return {
    DOM: view(model(streams))
  };
}

export default letter_slots;
