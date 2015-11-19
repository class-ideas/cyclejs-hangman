import Rx from 'rx';
import {h} from '@cycle/dom';

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
    return h('div.artwork', n.toString());
  });
}

function artwork({DOM, word$, guesses$}) {

  return {
    DOM: view(model({word$, guesses$}))
  };

}

export default artwork;
