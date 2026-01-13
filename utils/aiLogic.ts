
import { Player, Difficulty } from '../types';
import { calculateWinner, isBoardFull } from './gameUtils';

/**
 * Finds all indices where the cell is empty.
 */
const getAvailableIndices = (board: Player[]): number[] => {
  return board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val): val is number => val !== null);
};

/**
 * Checks if a player can win in one move.
 */
const findWinningMove = (board: Player[], player: Player): number | null => {
  const available = getAvailableIndices(board);
  for (const index of available) {
    const boardCopy = [...board];
    boardCopy[index] = player;
    if (calculateWinner(boardCopy)?.winner === player) {
      return index;
    }
  }
  return null;
};

/**
 * Easy: Purely random selection.
 */
const getEasyMove = (board: Player[]): number => {
  const available = getAvailableIndices(board);
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
};

/**
 * Medium: Wins if possible, blocks opponent win if possible, else random.
 */
const getMediumMove = (board: Player[]): number => {
  // 1. Try to win
  const winMove = findWinningMove(board, 'O');
  if (winMove !== null) return winMove;

  // 2. Block opponent's winning move
  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== null) return blockMove;

  // 3. Random move
  return getEasyMove(board);
};

/**
 * Hard: Minimax algorithm for unbeatable performance.
 */
const SCORES = { O: 10, X: -10, DRAW: 0 };

const minimax = (board: Player[], depth: number, isMaximizing: boolean): number => {
  const result = calculateWinner(board);
  if (result) return result.winner === 'O' ? SCORES.O - depth : SCORES.X + depth;
  if (isBoardFull(board)) return SCORES.DRAW;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of getAvailableIndices(board)) {
      board[index] = 'O';
      bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
      board[index] = null;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const index of getAvailableIndices(board)) {
      board[index] = 'X';
      bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
      board[index] = null;
    }
    return bestScore;
  }
};

const getHardMove = (board: Player[]): number => {
  let bestScore = -Infinity;
  let move = -1;
  const boardCopy = [...board];

  for (const index of getAvailableIndices(boardCopy)) {
    boardCopy[index] = 'O';
    const score = minimax(boardCopy, 0, false);
    boardCopy[index] = null;
    if (score > bestScore) {
      bestScore = score;
      move = index;
    }
  }
  return move;
};

/**
 * Strategy selector based on difficulty level.
 */
export const getAIMove = (board: Player[], difficulty: Difficulty): number => {
  switch (difficulty) {
    case Difficulty.HARD:
      return getHardMove(board);
    case Difficulty.MEDIUM:
      return getMediumMove(board);
    case Difficulty.EASY:
    default:
      return getEasyMove(board);
  }
};
