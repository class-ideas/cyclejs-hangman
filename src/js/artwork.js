import {h} from '@cycle/dom';
import {LEVEL_MAP} from './levels';

function view(strikes$) {
  return strikes$.map(n => {
    let sprites = [];
    for (var [label, strikes] of LEVEL_MAP) {
      let current = strikes === n ? 'current' : 'hidden';
      sprites.push(h(`div.${label}.${current}`));
    }
    return h('div.hangman-sprites', sprites);
  });
}

export default function (strikes$) {

  return {
    DOM: view(strikes$)
  };

}
