
import React, { useState, useEffect, useCallback } from 'react';
import Square from './components/Square';
import { Player, GameMode, GameState, Difficulty } from './types';
import { INITIAL_BOARD } from './constants';
import { calculateWinner, isBoardFull } from './utils/gameUtils';
import { getAIMove } from './utils/aiLogic';
import * as Sounds from './utils/soundEffects';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    xIsNext: true,
    winner: null,
    winningLine: null,
    mode: GameMode.AI,
    difficulty: Difficulty.MEDIUM,
    isDraw: false,
  });

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Persistence for mute state
  useEffect(() => {
    const saved = localStorage.getItem('tic-tac-toe-muted');
    if (saved !== null) {
      const muted = JSON.parse(saved);
      setIsMuted(muted);
      Sounds.setMuted(muted);
    }
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    Sounds.setMuted(next);
    localStorage.setItem('tic-tac-toe-muted', JSON.stringify(next));
  };

  // Core board update logic - handles pure state transition
  const executeMove = useCallback((index: number) => {
    setGameState(prev => {
      if (prev.board[index] || prev.winner || prev.isDraw) return prev;

      const newBoard = [...prev.board];
      newBoard[index] = prev.xIsNext ? 'X' : 'O';

      const winResult = calculateWinner(newBoard);
      const draw = !winResult && isBoardFull(newBoard);

      // Trigger Sounds based on the result
      if (winResult) {
        Sounds.playWinSound();
      } else if (draw) {
        Sounds.playDrawSound();
      } else {
        Sounds.playMoveSound();
      }

      return {
        ...prev,
        board: newBoard,
        xIsNext: !prev.xIsNext,
        winner: winResult?.winner || null,
        winningLine: winResult?.line || null,
        isDraw: draw,
      };
    });
  }, []);

  // UI Event handler for squares
  const handleSquareClick = (index: number) => {
    if (gameState.board[index] || gameState.winner || gameState.isDraw) return;
    if (isAiThinking) return;
    if (gameState.mode === GameMode.AI && !gameState.xIsNext) return;

    executeMove(index);
  };

  const resetGame = (newMode?: GameMode, newDifficulty?: Difficulty) => {
    setGameState(prev => ({
      board: Array(9).fill(null),
      xIsNext: true,
      winner: null,
      winningLine: null,
      mode: newMode || prev.mode,
      difficulty: newDifficulty || prev.difficulty,
      isDraw: false,
    }));
    setIsAiThinking(false);
  };

  useEffect(() => {
    // AI Trigger Logic
    if (
      gameState.mode === GameMode.AI && 
      !gameState.xIsNext && 
      !gameState.winner && 
      !gameState.isDraw
    ) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameState.board, gameState.difficulty);
        if (aiMove !== -1) {
          executeMove(aiMove);
        }
        setIsAiThinking(false);
      }, 700); 
      return () => clearTimeout(timer);
    }
  }, [gameState.xIsNext, gameState.mode, gameState.winner, gameState.isDraw, gameState.board, gameState.difficulty, executeMove]);

  const statusText = () => {
    if (gameState.winner) return `Winner: Player ${gameState.winner}`;
    if (gameState.isDraw) return "It's a Draw!";
    if (isAiThinking) return "AI is thinking...";
    return `Turn: ${gameState.xIsNext ? 'Player X' : 'Player O'}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            ELITE TIC TAC TOE
          </h1>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
            Classic Game • Modern Experience
          </p>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <div className="flex justify-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => resetGame(GameMode.AI)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                gameState.mode === GameMode.AI 
                ? 'bg-slate-800 text-cyan-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-robot"></i> AI Mode
            </button>
            <button
              onClick={() => resetGame(GameMode.PVP)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                gameState.mode === GameMode.PVP 
                ? 'bg-slate-800 text-rose-400 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-user-group"></i> PVP Mode
            </button>
          </div>

          {/* Difficulty Selector */}
          {gameState.mode === GameMode.AI && (
            <div className="flex justify-center p-1 bg-slate-900/50 rounded-xl border border-slate-800/50">
              {Object.values(Difficulty).map((diff) => (
                <button
                  key={diff}
                  onClick={() => resetGame(undefined, diff)}
                  className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all ${
                    gameState.difficulty === diff 
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-2 h-10">
           <div className={`text-xl font-bold flex items-center gap-3 transition-colors duration-300 ${
             gameState.winner ? 'text-green-400 animate-pulse' : 
             gameState.isDraw ? 'text-yellow-400' : 'text-slate-100'
           }`}>
             {gameState.winner && <i className="fa-solid fa-trophy"></i>}
             {statusText()}
           </div>
           <div className="flex items-center gap-2">
             <button 
               onClick={toggleMute}
               className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
               title={isMuted ? "Unmute" : "Mute"}
             >
               <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-up'} text-xl`}></i>
             </button>
             <button 
               onClick={() => resetGame()}
               className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
               title="Restart Game"
             >
               <i className="fa-solid fa-rotate-right text-xl"></i>
             </button>
           </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl">
          {gameState.board.map((square, i) => (
            <Square
              key={i}
              value={square}
              onClick={() => handleSquareClick(i)}
              isWinningSquare={gameState.winningLine?.includes(i) || false}
              disabled={!!gameState.winner || gameState.isDraw}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="flex justify-center space-x-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-80">
           <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></span>
             X: Human
           </div>
           <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]"></span>
             O: {gameState.mode === GameMode.AI ? `AI (${gameState.difficulty})` : 'Human'}
           </div>
        </div>
      </div>

      {/* Result Overlay */}
      {(gameState.winner || gameState.isDraw) && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full space-y-6 transform animate-in fade-in zoom-in duration-300">
             <div className="text-6xl mb-4">
               {gameState.winner === 'X' ? '🎉' : gameState.winner === 'O' ? '🤖' : '🤝'}
             </div>
             <h2 className="text-3xl font-bold text-white">
               {gameState.winner ? `Player ${gameState.winner} Wins!` : "It's a Draw!"}
             </h2>
             <p className="text-slate-400 text-sm leading-relaxed">
               {gameState.winner === 'O' && gameState.mode === GameMode.AI 
                 ? `The ${gameState.difficulty} AI found its way to victory.` 
                 : gameState.winner === 'X' && gameState.mode === GameMode.AI && gameState.difficulty === Difficulty.HARD
                 ? "You actually beat the Hard AI? Impossible!"
                 : "Excellent game! Want to go again?"}
             </p>
             <button
               onClick={() => resetGame()}
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
             >
               Play Again
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
