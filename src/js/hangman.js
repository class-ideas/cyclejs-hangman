import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import word$ from './word_stream';

import Keyboard from './keyboard';
import LetterSlots from './letter_slots';
import Artwork from './artwork';

function view(DOM) {

  let keyboard = Keyboard({DOM});
  let letterSlots = LetterSlots({
    DOM,
    word$,
    guesses$: keyboard.selectedKeys$
  });
  let artwork = Artwork({
    DOM,
    word$,
    guesses$: keyboard.selectedKeys$
  });

  return Rx.Observable.combineLatest(
    artwork.DOM,
    letterSlots.DOM,
    keyboard.DOM,
    keyboard.selectedKeys$,
    (artworkVtree, letterSlotsVtree, keyboardVtree, guesses) => {
      return h('div', [
        h('h1', 'Hang Man'),
        artworkVtree,
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
