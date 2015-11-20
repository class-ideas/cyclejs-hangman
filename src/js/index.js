import 'babel-polyfill';

import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import hangman from './hangman';

let drivers = {
  DOM: makeDOMDriver('.app')
};

Cycle.run(hangman, drivers);
