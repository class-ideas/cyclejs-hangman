import Rx from 'rx';
import {h} from '@cycle/dom';

import {WINNING_LEVEL, LOSING_LEVEL} from './levels';

let set = obs => {
  return obs
    .scan((set, next) => set.add(next), new Set())
    .startWith(new Set());
}

function intent(DOM, word$) {
  let key$ = DOM
    .select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent)

  let allGuesses$ = word$.flatMap(() => (
    set(key$).takeUntil(word$)
  ));

  let allStrikes$ = allGuesses$.combineLatest(word$,
    (guesses, word) => {
      let letters = new Set( word );
      let correct = new Set();
      for (let c of guesses) {
        if (letters.has(c)) {
          correct.add(c);
        }
      }
      if (correct.size === letters.size) {
        return WINNING_LEVEL;
      }
      return guesses.size - correct.size;
    }
  );

  let gameOver$ = allStrikes$.filter(strikes => {
    return strikes === WINNING_LEVEL ||
           strikes === LOSING_LEVEL
  });

  let guesses$ = allGuesses$.takeUntil(gameOver$);
  let strikes$ = allStrikes$.takeUntil(gameOver$);

  return {
    guesses$,
    strikes$
  };
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.of([ROW_ONE, ROW_TWO]);
}

function model(guesses$) {
  return keyboardRows()
    .combineLatest(guesses$, (rows, guesses) => {
      return rows.map(row => {
        return row.map(char => ({
          char,
          props: {
            disabled: guesses.has(char)
          }
        }));
      });
    });
}

function view(state$) {
  return state$.map(rows => {
    return h('div.keyboard', rows.map(row => {
      return h('div.keyboard-row', row.map(d => {
        return h('button.keyboard-button', d.props, d.char);
      }));
    }));
  });
}

function keyboard({DOM, word$}) {
  let {guesses$, strikes$} = intent(DOM, word$);
  let vtree$ = view(model(guesses$));

  return {
    DOM: vtree$,
    guesses$,
    strikes$
  };
}

export default keyboard;
