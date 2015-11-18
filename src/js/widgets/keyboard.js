import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  let selectedKeys$ = DOM.select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent)
    .scan((keys, key) => {
      keys.push(key);
      return keys;
    }, [])
    .startWith([]);

  return {
    selectedKeys$
  }
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.from([[ROW_ONE, ROW_TWO]]);
}

function model(context, actions) {
  let disabled$ = actions.selectedKeys$;
  let rows$ = keyboardRows();

  return Rx.Observable
    .combineLatest(disabled$, rows$, (disabled, rows) => {
      return rows.map(row => row.map(char => {
        let data = {char, props:{}};
        if (disabled.indexOf(char) >= 0) {
          data.props.disabled = 'disabled';
        }
        return data;
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


function keyboard(responses) {

  let actions = intent(responses.DOM);
  let vtree$ = view(model(responses, actions));

  return {
    DOM: vtree$,
    events: {
      selectedKeys: actions.selectedKeys$
    }
  };

}

export default keyboard;
