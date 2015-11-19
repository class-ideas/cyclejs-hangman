import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  var selectedKeys$ = DOM
    .select('.keyboard-button')
    .events('click')
    .distinct()
    .map(e => e.target.textContent)
    .scan((keySet, key) => {
      keySet.add(key);
      return keySet;
    }, new Set())
    .startWith(new Set());

  return {
    selectedKeys$
  }
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.from([[ROW_ONE, ROW_TWO]]);
}

function model(actions) {
  let disabled$ = actions.selectedKeys$;
  let rows$ = keyboardRows();

  return Rx.Observable
    .combineLatest(disabled$, rows$, (disabled, rows) => {
      return rows.map(row => row.map(char => {
        return {
          char,
          props: {
            disabled: disabled.has(char)
          }
        };
      }));
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
  let vtree$ = view(model(actions));
  let {selectedKeys$} = actions;

  return {
    DOM: vtree$,
    selectedKeys$
  };

}

export default keyboard;
