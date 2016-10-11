import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';

import main from './hangman';

let drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
