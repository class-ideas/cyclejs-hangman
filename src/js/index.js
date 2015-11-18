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

  return guesses$;
}

function view(state$) {
  return state$.map((guesses) => {
    console.log('guesses a:', guesses);
    return h('div', [
      h('h2', 'Cycle Hangman'),
      h('keyboard', {disabled: guesses}),
      h('div', [
        h('string', 'guesses:'),
        guesses.map(char => h('span', char))
      ])
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
