import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats'
import {h} from '@cycle/dom';

import {
  WINNING_LEVEL,
  LOSING_LEVEL,
  LEVEL_MAP
} from './levels';

const VALID_LEVELS = new Set(LEVEL_MAP.values());

function intent({DOM, word$}) {
  let key$ = DOM
    .select('.keyboard-button')
    .events('click')
    .map(e => e.target.getAttribute('data-char'));

  let guesses$ = word$.map(
    () => key$.fold(
      (set, next) => set.add(next), new Set()
    )
  ).flatten().remember();

  let strikes$ =
    xs.combine(word$, guesses$).map(([word, guesses]) => {
      let letters = new Set(word);
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
    .filter(::VALID_LEVELS.has)
    .remember();

  let isGameOver$ = strikes$.map(strikes => {
    return strikes === WINNING_LEVEL ||
           strikes === LOSING_LEVEL;
  }).remember();

  return {
    guesses$,
    strikes$,
    isGameOver$
  };
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return xs.of([ROW_ONE, ROW_TWO]);
}

function model({guesses$, isGameOver$}) {
  return xs.combine(keyboardRows(), guesses$, isGameOver$)
    .map(([rows, guesses, isGameOver]) => {
      return rows.map(row => {
        return row.map(char => ({
          char,
          props: {
            attrs: {
              'data-char': char,
              disabled: isGameOver || guesses.has(char)
            }
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
  let {guesses$, strikes$, isGameOver$} = intent({DOM, word$});
  let vtree$ = view(model({guesses$, isGameOver$}));

  return {
    DOM: vtree$,
    guesses$,
    strikes$,
    isGameOver$
  };
}

export default keyboard;
