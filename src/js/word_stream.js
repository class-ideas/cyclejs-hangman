import words from './words';

export default {
  sample() {
    return words[Math.floor(Math.random()*words.length)];
  }
}
