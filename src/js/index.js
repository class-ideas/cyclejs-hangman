import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import keyboard from './widgets/keyboard';


function intent(DOM) {
  return {
    selectedKeys: DOM
      .select('.keyboard')
      .events('selectedKeys')
      .map(e => e.detail)
      .startWith([])
  }
}

function model(actions) {
  let guesses$ = actions.selectedKeys;

  return guesses$;
}

function view(state$) {
  return state$.map((guesses) => {
    return h('div', [
      h('h2', 'Cycle Hangman'),
      h('keyboard'),
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
