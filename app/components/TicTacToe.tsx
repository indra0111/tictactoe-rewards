"use client";
import { useState, useEffect } from 'react';
import Confetti from 'confetti-react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';

type Square = 'X' | 'O' | null;

const TicTacToe = () => {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [copied, setCopied] = useState(false);

  const checkWinner = (squares: Square[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'WIN';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleClick = (index: number) => {
    if (!isHumanTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsHumanTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setCouponCode(generateCouponCode());
      setShowReward(true);
      return;
    }
  };

  const isDraw = (squares: Square[]): boolean => {
    return squares.every(square => square !== null);
  };

  const findBestMove = (squares: Square[]): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    // Try all possible moves
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        let score = minimax(squares, 0, false);
        squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const minimax = (squares: Square[], depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(squares);
    
    // Terminal states
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (squares.every(square => square !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
          squares[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
          squares[i] = null;
        }
      }
      return bestScore;
    }
  };

  const findNormalMove = (squares: Square[]): number => {
    const emptyCells = squares
      .map((cell, index) => cell === null ? index : null)
      .filter((cell): cell is number => cell !== null);
      
      return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
  }

  useEffect(() => {
    if (!isHumanTurn && !winner) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        // const bestMove = findBestMove(newBoard);
        const bestMove = findNormalMove(newBoard);
        
        if (bestMove !== -1) {
          newBoard[bestMove] = 'O';
          setBoard(newBoard);
          
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
          }
        }
        setIsHumanTurn(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, board, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsHumanTurn(true);
    setWinner(null);
    setShowReward(false);
  };

  const handleImageError = (e: any) => {
    console.error('Error loading image:', e);
    e.target.style.display = 'none';
  };

  // const confettiConfig = {
  //   drawShape: (ctx: CanvasRenderingContext2D) => {
  //     const img = new (window.Image as { new(): HTMLImageElement })();
      
  //     img.src = '/images.png';
      
  //     img.onload = () => {
  //       ctx.drawImage(img, -15, -15, 30, 30);
  //     };
  //   },
  //   numberOfPieces: 50,
  //   recycle: false,
  //   gravity: 0.5,
  // };
  // const img = new (window.Image as { new(): HTMLImageElement })();
  // img.src = '/images.png';
  // const confettiConfig = {
  //   drawShape: (ctx: CanvasRenderingContext2D) => {
  //     if (img.complete) {
  //       ctx.drawImage(img, -15, -15, 30, 30);
  //     }
  //     // const img = new (window.Image as { new(): HTMLImageElement })();
  //     // img.src = '/images.png';
      
  //     // img.onload = () => {
  //     //   ctx.drawImage(img, -15, -15, 30, 30);
  //     // };
  //   },
  //   numberOfPieces: 50,
  //   recycle: true,
  //   gravity: 0.5,
  // };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      {/* {winner === 'X' && <Confetti {...confettiConfig} />} */}
      {winner === 'X' && <Confetti />}
      
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-24 h-24 bg-gray-100 rounded-lg text-6xl font-bold flex items-center justify-center relative
                ${!square && !winner && isHumanTurn ? 'hover:bg-gray-200' : ''}
                ${square === 'X' ? 'text-blue-500' : 'text-red-500'}`}
            >
              {square && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/qJmHY4IezzI0.gif"
                    alt={square}
                    width={96}
                    height={96}
                    className="rounded-lg object-cover opacity-50"
                    onError={handleImageError}
                    unoptimized 
                  />
                </div>
              )}
              <span className="relative z-10">{square}</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl mb-4">
            {winner 
              ? `${winner === 'X' ? 'Incredible - You won!' : 'The AI prevails!'}`
              : isDraw(board)
                ? 'A strategic draw!'
                : `${isHumanTurn ? 'Your move' : 'AI calculating best move...'}`}
          </p>
          <button
            onClick={resetGame}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {winner || isDraw(board) ? 'Retry' : 'New Game'}
          </button>
        </div>
      </div>

        <Dialog
        open={showReward}
        onClose={() => setShowReward(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-xl p-8 max-w-md mx-auto">
            <Dialog.Title className="text-2xl font-bold text-center mb-4">
              🎉 Congratulations! You Won! 🎉
            </Dialog.Title>
            <Dialog.Description className="text-center mb-6">
              Here's your 10% discount coupon code:
            </Dialog.Description>
            
            <div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-mono font-bold text-purple-600">
                  {couponCode}
                </p>
                <button
                  onClick={handleCopyClick}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    // Checkmark icon for feedback
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    // Copy icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowReward(false)}
              className="w-full bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TicTacToe; 