import Rx from 'rx';
import {h} from '@cycle/dom';

let set = obs => {
  return obs
    .scan((set, next) => set.add(next), new Set())
    .startWith(new Set());
}

function intent(DOM, word$) {
  let key$ = DOM
    .select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent)

  let guesses$ = word$.flatMap(() => (
    set(key$).takeUntil(word$)
  ));

  return guesses$;
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.of([ROW_ONE, ROW_TWO]);
}

function model(guesses$) {
  return keyboardRows()
    .combineLatest(guesses$, (rows, guesses) => {
      return rows.map(row => {
        return row.map(char => ({
          char,
          props: {
            disabled: guesses.has(char)
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

function keyboard({DOM, word$}) {
  let guesses$ = intent(DOM, word$);
  let vtree$ = view(model(guesses$));

  return {
    DOM: vtree$,
    guesses$
  };
}

export default keyboard;
