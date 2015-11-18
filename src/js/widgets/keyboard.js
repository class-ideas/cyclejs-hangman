import Rx from 'rx';
import {h} from '@cycle/dom';

function intent(DOM) {
  let key$ = DOM.select('.keyboard-button')
    .events('click')
    .map(e => e.target.textContent);

  return {
    key$
  }
}

function keyboardRows() {
  const ROW_ONE = 'abcdefghijklm'.split('');
  const ROW_TWO = 'nopqrstuvwxyz'.split('');

  return Rx.Observable.from([[ROW_ONE, ROW_TWO]]);
}

function model(context, actions) {
  let disabled$ = context.props.get('disabled');
  let rows$ = keyboardRows();

  let keyTemp$ = actions.key$.startWith('');

  return Rx.Observable
    .combineLatest(disabled$, rows$, (disabled, rows) => {
      return rows.map(row => row.map(char => {
        let data = {char, props:{}};
        if (disabled.indexOf(char) >= 0) {
          data.props.disabled = 'disabled';
        }
        if (data.props.disabled) {
          console.log('disabled prop for', char, data.props.disabled, 'disabled-list:', disabled);
        }
        return data;
      }));
    });
}

function view(state$) {
  window.state$ = state$;
  return state$.map(rows => {
    console.log('new data point:', rows);
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
      key: actions.key$
    }
  };

}

export default keyboard;
