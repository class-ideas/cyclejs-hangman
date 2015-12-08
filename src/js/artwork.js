/** @jsx hJSX */

import {h, hJSX} from '@cycle/dom';
import {LEVEL_MAP} from './levels';
import classes from 'classnames';

function view(strikes$) {
  return strikes$.map(n => {
    let sprites = [];
    
    for (var [label, strikes] of LEVEL_MAP) {
      let current = strikes === n ? 'current' : 'hidden';
      sprites.push(
        <div className={classes(label, current)}/>
      );
    }
    
    return (
      <div className="hangman-sprites">
        {sprites}
      </div>
    );
  });
}

export default function (strikes$) {

  return {
    DOM: view(strikes$)
  };

}
