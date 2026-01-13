
export type Player = 'X' | 'O' | null;

export enum GameMode {
  PVP = 'PVP',
  AI = 'AI'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface GameState {
  board: Player[];
  xIsNext: boolean;
  winner: Player;
  winningLine: number[] | null;
  mode: GameMode;
  difficulty: Difficulty;
  isDraw: boolean;
}
