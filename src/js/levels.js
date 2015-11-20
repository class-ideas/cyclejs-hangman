const WINNING_LEVEL = -1;
const LOSING_LEVEL = 6;
const LEVEL_MAP = new Map([
  ['strike-0', 0],
  ['strike-1', 1],
  ['strike-2', 2],
  ['strike-3', 3],
  ['strike-4', 4],
  ['strike-5', 5],
  ['gameover', LOSING_LEVEL],
  ['gamewon',  WINNING_LEVEL]
]);

export {
  WINNING_LEVEL,
  LOSING_LEVEL,
  LEVEL_MAP
}
