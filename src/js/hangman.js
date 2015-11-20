import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import word$ from './word_stream';

import {WINNING_LEVEL, LOSING_LEVEL} from './levels';

import Keyboard from './keyboard';
import LetterSlots from './letter_slots';
import Artwork from './artwork';

function view(DOM) {

  let keyboard = Keyboard({DOM});
  
  let letterSlots = LetterSlots({
    word$,
    guesses$: keyboard.selectedKeys$
  });
  
  let strikes$ = Rx.Observable.combineLatest(word$, keyboard.selectedKeys$,
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
      if (correct.size === letters.size) {
        return WINNING_LEVEL;
      }
      return guesses.size - correct.size;
    }
  );

  let gameOn$ = strikes$.map(count => {
    return (count !== WINNING_LEVEL) && (count !== LOSING_LEVEL);
  });

  let artwork = Artwork(strikes$);

  return Rx.Observable.combineLatest(
    artwork.DOM,
    letterSlots.DOM,
    keyboard.DOM,
    keyboard.selectedKeys$,
    gameOn$,
    (artworkVtree, letterSlotsVtree, keyboardVtree, guesses, gameOn) => {
      return h('div', [
        h('h1', 'Hang Man'),
        artworkVtree,
        letterSlotsVtree,
        keyboardVtree,
        h('div', [
          h('string', 'guesses:'),
          Array.from(guesses).map(char => h('span', char))
        ]),
        h(`button.new-game.${gameOn ? 'hidden' : 'shown'}`, {disabled: gameOn}, 'New Game')
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
