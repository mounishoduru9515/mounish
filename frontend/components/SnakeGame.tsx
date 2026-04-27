import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Point } from '../types';
import { GlitchText } from './GlitchText';

// Custom hook for robust intervals in React
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const dirRef = useRef<Point>(INITIAL_DIRECTION);
  const lastProcessedDirRef = useRef<Point>(INITIAL_DIRECTION);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIRECTION;
    lastProcessedDirRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    generateFood(INITIAL_SNAKE);
    // Focus game area to capture keys immediately
    gameAreaRef.current?.focus();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDir = dirRef.current;
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Self Collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      lastProcessedDirRef.current = currentDir;
      return newSnake;
    });
  }, [gameOver, isPaused, hasStarted, food, generateFood]);

  useInterval(moveSnake, gameOver || isPaused || !hasStarted ? null : GAME_SPEED);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted) return;
      
      // Prevent default scrolling for game keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = lastProcessedDirRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) dirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) dirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) dirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) dirRef.current = { x: 1, y: 0 };
          break;
        case ' ':
        case 'Escape':
          if (!gameOver) setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  // Render grid cells
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = "w-full h-full border-[0.5px] border-cyan-900/20 ";
        
        if (isSnakeHead) {
          cellClass += "bg-fuchsia-500 shadow-[0_0_8px_#f0f] z-10 relative";
        } else if (isSnakeBody) {
          cellClass += "bg-cyan-400 shadow-[0_0_5px_#0ff] opacity-80";
        } else if (isFood) {
          cellClass += "bg-yellow-400 shadow-[0_0_10px_#ff0] animate-pulse";
        } else {
          cellClass += "bg-transparent";
        }

        cells.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Header / Score */}
      <div className="w-full flex justify-between items-end mb-2 px-2 border-b border-cyan-800 pb-2">
        <div className="text-cyan-600 text-sm">SEQ_SCORE:</div>
        <GlitchText text={score.toString().padStart(4, '0')} className="text-2xl text-cyan-300" />
      </div>

      {/* Game Board Container */}
      <div 
        ref={gameAreaRef}
        tabIndex={0}
        className="relative w-full aspect-square bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.2),inset_0_0_20px_rgba(0,255,255,0.1)] outline-none focus:border-fuchsia-500 transition-colors duration-300"
      >
        {/* Grid */}
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <GlitchText text="SYSTEM_READY" className="mb-4 text-cyan-400" asHeader />
            <button 
              onClick={resetGame}
              className="px-6 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 hover:text-white hover:shadow-[0_0_15px_#0ff] transition-all font-header text-xs"
            >
              INITIATE_SEQUENCE
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <GlitchText text="PAUSED" className="text-fuchsia-500 tracking-widest" asHeader />
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-red-900/30 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-4 border-red-600 animate-pulse">
            <GlitchText text="CRITICAL_FAILURE" className="mb-2 text-red-500" asHeader />
            <div className="text-red-400 mb-6 text-sm">ENTITY_TERMINATED</div>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border border-red-500 text-red-400 hover:bg-red-900/50 hover:text-white hover:shadow-[0_0_15px_#f00] transition-all font-header text-xs"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
      
      <div className="w-full mt-2 text-xs text-cyan-700 flex justify-between px-2">
        <span>[W,A,S,D] / ARROWS : OVERRIDE_DIR</span>
        <span>[SPACE] : HALT_PROCESS</span>
      </div>
    </div>
  );
};
