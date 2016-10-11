import xs from 'xstream';
import {div, span} from '@cycle/dom';

function view({word$, guesses$, isGameOver$}) {
  return xs.combine(word$, guesses$, isGameOver$)
    .map(([word, guesses, isGameOver]) => {
      return div('.letter-slots', word.split('').map(char => {
        let classNames = ['letter-slot'];
        let text = guesses.has(char) ? char : ' ';
        if (text === ' ' && isGameOver) {
          classNames.push('revealed');
          text = char;
        }
        let className = classNames.join(' ');
        return span({props: {className}}, text);
      }));
    });
}

function letter_slots({word$, guesses$, isGameOver$}) {
  return {
    DOM: view({word$, guesses$, isGameOver$})
  };
}

export default letter_slots;
