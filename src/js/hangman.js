import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import word$ from './word_stream';

import Keyboard from './keyboard';
import LetterSlots from './letter_slots';

function view(DOM) {

  let keyboard = Keyboard({DOM});
  let letterSlots = LetterSlots({
    DOM,
    word$,
    guesses$: keyboard.selectedKeys$
  });

  return Rx.Observable.combineLatest(
    letterSlots.DOM,
    keyboard.DOM,
    keyboard.selectedKeys$,
    (letterSlotsVtree, keyboardVtree, guesses) => {
      return h('div', [
        h('h2', 'Cycle Hangman'),
        letterSlotsVtree,
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
