import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import keyboard from './widgets/keyboard';


function intent(DOM) {
  return {
    keyPress: DOM.select('.keyboard').events('key').map(e => e.detail)
  }
}

function model(actions) {
  let guesses$ = actions.keyPress.scan((keys, key) => {
    keys.push(key);
    return keys;
  }, []).startWith([]);

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  let alphabet$ = Rx.Observable.from([ALPHABET]);

  return Rx.Observable.combineLatest(guesses$, alphabet$, 
    (guesses, alphabet) => { return {guesses, alphabet}; }
  );
}

function view (state$) {
  return state$.map((state) => {
    console.log('guesses a:',state.guesses);
    return h('div', [
      h('h2', ['Cycle Hangman']),
      h('keyboard', {state})
    ]);
  });
}

function main({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}

let drivers = {
  DOM: makeDOMDriver('.app', {
    'keyboard': keyboard
  })
};

Cycle.run(main, drivers);
