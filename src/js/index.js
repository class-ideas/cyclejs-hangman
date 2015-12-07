import 'babel-polyfill';

import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import hangman from './hangman';

let drivers = {
  DOM: makeDOMDriver('.app')
};

Cycle.run(hangman, drivers);
