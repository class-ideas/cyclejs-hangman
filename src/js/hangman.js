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

  let guesses$ = keyboard.guesses$.share();

  let strikes$ = keyboard.strikes$;

  // let strikes$ = word$.flatMap((word) => {
  //   let allStrikes$ = guesses$
  //     .map(guesses => {
  //     let letters = new Set( word );
  //     let correct = new Set();
  //     for (let c of guesses) {
  //       if (letters.has(c)) {
  //         correct.add(c);
  //       }
  //     }
  //     if (correct.size === letters.size) {
  //       return WINNING_LEVEL;
  //     }
  //     return guesses.size - correct.size;
  //   });
  //   let gameOver$ = allStrikes$.filter(strikes => {
  //     return strikes === WINNING_LEVEL ||
  //            strikes === LOSING_LEVEL
  //   });
  //   return allStrikes$.takeUntil(gameOver$);
  // });

  // window.strikes$ = strikes$;

  // let strikes$ = guesses$.combineLatest(word$, 
  //   (guesses, word) => {
  //     let letters = new Set( word.split('') );
  //     let correct = new Set();
  //     for (let c of guesses) {
  //       if (letters.has(c)) {
  //         correct.add(c);
  //       }
  //     }
  //     if (correct.size === letters.size) {
  //       return WINNING_LEVEL;
  //     }
  //     return guesses.size - correct.size;
  //   }
  // );

  // let strikes$ = guesses$.combineLatest(word$, 
  //   (guesses, word) => {
  //     let letters = new Set( word.split('') );
  //     let correct = new Set();
  //     for (let c of guesses) {
  //       if (letters.has(c)) {
  //         correct.add(c);
  //       }
  //     }
  //     if (correct.size === letters.size) {
  //       return WINNING_LEVEL;
  //     }
  //     return guesses.size - correct.size;
  //   }
  // );

  // let strikesTemp$ = guesses$.combineLatest(word$, 
  //   (guesses, word) => {
  //     let letters = new Set( word.split('') );
  //     let correct = new Set();
  //     for (let c of guesses) {
  //       if (letters.has(c)) {
  //         correct.add(c);
  //       }
  //     }
  //     if (correct.size === letters.size) {
  //       return WINNING_LEVEL;
  //     }
  //     return guesses.size - correct.size;
  //   }
  // );

  // let strikes$ = Rx.Observable.just(WINNING_LEVEL);
  // let strikes$ = word$.flatMap(() => Rx.Observable.just(WINNING_LEVEL));
  // let strikes$ = strikesTemp$;
  // let strikes$ = word$.flatMap(() => strikesTemp$);
  // let strikes$ = word$.flatMap(() => strikesTemp$);

  let artwork = Artwork(strikes$);

  let gameOn$ = strikes$.map(count => {
    return (count !== WINNING_LEVEL) &&
           (count !== LOSING_LEVEL);
  });

  let letterSlots = LetterSlots({
    word$,
    guesses$,
    gameOn$
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
