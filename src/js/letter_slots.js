/** @jsx hJSX */

import Rx from 'rx';
import {h, hJSX} from '@cycle/dom';
import classes from 'classnames';

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
    return (
      <div className="letter-slots">
        {word.split('').map(char => {
          let revealed = !guesses.has(char) && gameOver;
          let className = classes('letter-slot', {revealed});
          let text = guesses.has(char) || gameOver ? char : ' ';
          return (
            <span className={className}>{text}</span>
          );
        })}
      </div>
    );
  });
}

function letter_slots(streams) {
  return {
    DOM: view(model(streams))
  };
}

export default letter_slots;
