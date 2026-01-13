
import { WINNING_COMBINATIONS } from '../constants';
import { Player } from '../types';

export const calculateWinner = (squares: Player[]) => {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: WINNING_COMBINATIONS[i]
      };
    }
  }
  return null;
};

export const isBoardFull = (squares: Player[]) => {
  return squares.every(square => square !== null);
};
