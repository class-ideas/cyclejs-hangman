import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import words from './word_stream';

import {WINNING_LEVEL, LOSING_LEVEL} from './levels';

import Keyboard from './keyboard';
import LetterSlots from './letter_slots';
import Artwork from './artwork';
import NewGameButton from './new_game_button';

function view(DOM) {

  let newGameButton = NewGameButton({DOM});

  let word$ = newGameButton.newGame$
    .startWith(true)
    .map(words.sample)
    .share()
    .doOnNext(w => console.log('word:', w));

  let keyboard = Keyboard({DOM, word$});

  let guesses$ = keyboard.guesses$;

  let letterSlots = LetterSlots({
    word$,
    guesses$
  });
  
  let strikes$ = Rx.Observable.combineLatest(word$, guesses$,
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
    newGameButton.DOM,
    artwork.DOM,
    letterSlots.DOM,
    keyboard.DOM,
    guesses$,
    (newGameButton, artworkVtree, letterSlotsVtree, keyboardVtree, guesses) => {
      return h('div', [
        h('h1', 'Hang Man'),
        artworkVtree,
        letterSlotsVtree,
        keyboardVtree,
        // h('div', [
        //   h('string', 'guesses:'),
        //   Array.from(guesses).map(char => h('span', char))
        // ]),
        newGameButton
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
