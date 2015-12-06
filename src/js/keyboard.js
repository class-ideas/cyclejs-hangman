import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  return {
    presses$: DOM
      .select('.keyboard-button')
      .events('click')
      .map(e => e.target.textContent)
  }
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.of([ROW_ONE, ROW_TWO]);
}

function model() {
  return keyboardRows().map(rows => {
    return rows.map(row => {
      return row.map(char => ({
        char,
        props: {
          disabled: false
        }
      }));
    });
  });
}

function view(state$) {
  return state$.map(rows => {
    return h('div.keyboard', rows.map(row => {
      return h('div.keyboard-row', row.map(d => {
        return h('button.keyboard-button', d.props, d.char);
      }));
    }));
  });
}

function keyboard({DOM}) {
  let actions = intent(DOM);
  let vtree$ = view(model());
  let {presses$} = actions;

  return {
    DOM: vtree$,
    presses$
  };
}

export default keyboard;
