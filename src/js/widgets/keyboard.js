import Rx from 'rx';
import {h} from '@cycle/dom';


function keyboard(responses) {

  // const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // let alphabet = responses.props.get('alphabet');
  // let guesses = responses.props.get('guesses');

  let state$ = responses.props.get('state');

  console.log('setting up keybaord with:', state$);

  let vtree$ = state$
    .map(({guesses, alphabet}) => {
      console.log('guesses b:', guesses);
      return h('div.keyboard', alphabet.map(char => {
        let atts;
        if (guesses.indexOf(char) >= 0) {
          atts = {disabled: 'disabled'};
        } else {
          atts = {};
        }
        return h('button.keyboard-button', atts, [char]);
      }))
    });

  let key$ = responses.DOM.select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent);

  return {
    DOM: vtree$,
    events:{
      key: key$
    }
  }

}

export default keyboard;
