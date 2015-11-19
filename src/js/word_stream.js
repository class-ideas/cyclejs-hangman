import words from './words';
import Rx from 'rx';

let word = words[Math.floor(Math.random()*words.length)];

export default Rx.Observable.of(word);
