import Rx from 'rx';
import {h} from '@cycle/dom';

const WINNING_LEVEL = -1;
const LOSING_LEVEL = 6;
const LEVEL_MAP = new Map([
  ['strike-0', 0],
  ['strike-1', 1],
  ['strike-2', 2],
  ['strike-3', 3],
  ['strike-4', 4],
  ['strike-5', 5],
  ['gameover', LOSING_LEVEL],
  ['gamewon',  WINNING_LEVEL]
]);

function model({word$, guesses$}) {
  return Rx.Observable.combineLatest(word$, guesses$,
    (word, guesses) => {
      let letters = new Set( word.split('') );
      // when babel 6 will compile use this:
      //let correct = new Set([c for (c of guesses) if (letters.has(c))]);
      // until then:
      let correct = new Set();
      for (let c of guesses) {
        if (letters.has(c)) {
          correct.add(c);
        }
      }
      return guesses.size - correct.size;
    }
  );
}

function view(incorrectGuessCount$) {
  return incorrectGuessCount$.map(n => {
    let sprites = [];
    for (var [label, strikes] of LEVEL_MAP) {
      let current = strikes === n ? 'current' : 'hidden';
      sprites.push(h(`div.${label}.${current}`));
    }
    return h('div.hangman-sprites', sprites);
  });
}

function artwork({DOM, word$, guesses$}) {

  return {
    DOM: view(model({word$, guesses$}))
  };

}

export default artwork;
