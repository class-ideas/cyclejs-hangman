import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import words from './word_stream';

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

  let {guesses$, strikes$, gameOver$} = keyboard;

  let artwork = Artwork(strikes$);

  let letterSlots = LetterSlots({
    word$,
    guesses$,
    gameOver$
  });

  return Rx.Observable.combineLatest(
    newGameButton.DOM,
    artwork.DOM,
    letterSlots.DOM,
    keyboard.DOM,
    guesses$,
    (newGameButton,
     artworkVtree,
     letterSlotsVtree,
     keyboardVtree,
     guesses) => {
      return h('div', [
        h('h1', 'Hang Man'),
        artworkVtree,
        letterSlotsVtree,
        keyboardVtree,
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
