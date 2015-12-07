import Rx from 'rx';
import {h} from '@cycle/dom';

import {
  WINNING_LEVEL, 
  LOSING_LEVEL, 
  LEVEL_MAP
} from './levels';

let set = obs$ => {
  return obs$
    .scan((set, next) => set.add(next), new Set())
    .startWith(new Set());
}

let validLevels = new Set(LEVEL_MAP.values());

function intent(DOM, word$) {
  let key$ = DOM
    .select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent)

  let guesses$ = word$.flatMapLatest(() => (
    set(key$).takeUntil(word$)
  )).share();

  let strikes$ = guesses$
    .combineLatest(word$, (guesses, word) => {
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
    })
    .filter(::validLevels.has)
    .share();

  let gameOver$ = strikes$.map(strikes => {
    return strikes === WINNING_LEVEL ||
           strikes === LOSING_LEVEL;
  });

  return {
    guesses$,
    strikes$,
    gameOver$
  };
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.of([ROW_ONE, ROW_TWO]);
}

function model({guesses$, gameOver$}) {
  return keyboardRows()
    .combineLatest(
      guesses$, gameOver$, 
      (rows, guesses, gameOver) => {
        return rows.map(row => {
          return row.map(char => ({
            char,
            props: {
              disabled: gameOver || guesses.has(char)
            }
          }));
        });
      }
    );
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
  let {guesses$, strikes$, gameOver$} = intent(DOM, word$);
  let vtree$ = view(model({guesses$, gameOver$}));

  return {
    DOM: vtree$,
    guesses$,
    strikes$,
    gameOver$
  };
}

export default keyboard;
