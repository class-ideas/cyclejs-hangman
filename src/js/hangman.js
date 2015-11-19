import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import Keyboard from './keyboard';

function view(DOM) {

  let keyboard = Keyboard({DOM});

  return Rx.Observable.combineLatest(
    keyboard.DOM,
    keyboard.selectedKeys$,
    (keyboardVtree, guesses) => {
      return h('div', [
        h('h2', 'Cycle Hangman'),
        keyboardVtree,
        h('div', [
          h('string', 'guesses:'),
          Array.from(guesses).map(char => h('span', char))
        ])
      ]);
    }
  );
}

function hangman({DOM}) {
  return {
    DOM: view(DOM)
  };
}

export default hangman;
