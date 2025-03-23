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
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [gamesWon, setGamesWon] = useState(0);
  const [currentDiscountTier, setCurrentDiscountTier] = useState(10);
  const [isHolidaySeason, setIsHolidaySeason] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [mounted, setMounted] = useState(false);

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
    const discountPercent = gamesWon >= 3 ? 20 : 10;
    setCurrentDiscountTier(discountPercent);
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = `WIN${discountPercent}`;
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
      setGamesWon(gamesWon + 1);
      return;
    }
  };

  const isDraw = (squares: Square[]): boolean => {
    return squares.every(square => square !== null);
  };

  // const findBestMove = (squares: Square[]): number => {
  //   let bestScore = -Infinity;
  //   let bestMove = -1;

  //   // Try all possible moves
  //   for (let i = 0; i < squares.length; i++) {
  //     if (!squares[i]) {
  //       squares[i] = 'O';
  //       let score = minimax(squares, 0, false);
  //       squares[i] = null;

  //       if (score > bestScore) {
  //         bestScore = score;
  //         bestMove = i;
  //       }
  //     }
  //   }
  //   return bestMove;
  // };

  // const minimax = (squares: Square[], depth: number, isMaximizing: boolean): number => {
  //   const winner = checkWinner(squares);
    
  //   // Terminal states
  //   if (winner === 'O') return 10 - depth;
  //   if (winner === 'X') return depth - 10;
  //   if (squares.every(square => square !== null)) return 0;

  //   if (isMaximizing) {
  //     let bestScore = -Infinity;
  //     for (let i = 0; i < squares.length; i++) {
  //       if (!squares[i]) {
  //         squares[i] = 'O';
  //         bestScore = Math.max(bestScore, minimax(squares, depth + 1, false));
  //         squares[i] = null;
  //       }
  //     }
  //     return bestScore;
  //   } else {
  //     let bestScore = Infinity;
  //     for (let i = 0; i < squares.length; i++) {
  //       if (!squares[i]) {
  //         squares[i] = 'X';
  //         bestScore = Math.min(bestScore, minimax(squares, depth + 1, true));
  //         squares[i] = null;
  //       }
  //     }
  //     return bestScore;
  //   }
  // };

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

  useEffect(() => {
    if (winner === 'O') {
      setShowLoseModal(true);
    } else if (isDraw(board) && !winner) {
      setShowDrawModal(true);
    }
  }, [winner, board]);

  useEffect(() => {
    setMounted(true);
    setIsHolidaySeason(new Date().getMonth() === 11);
    setShareUrl(window.location.href);
  }, []);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsHumanTurn(true);
    setWinner(null);
    setShowReward(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading image:", e);
    e.currentTarget.style.display = "none"; // Use `currentTarget` instead of `target`
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

  const shareText = `I just won a ${currentDiscountTier}% discount at Myntra! Play Tic-Tac-Toe and win yours too! 🎮 🎁`;

  const shareToSocialMedia = (platform: string) => {
    if (!mounted) return;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      telegram: `https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'noopener,noreferrer');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center 
      ${isHolidaySeason ? 'bg-gradient-to-br from-red-500 to-green-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'} 
      p-4`}>
      {isHolidaySeason && <div className="absolute inset-0 pointer-events-none">
      </div>}
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
              ? `${winner === 'X' ? 'Incredible - You won!' : 'Opponent wins!'}`
              : isDraw(board)
                ? 'A strategic draw!'
                : `${isHumanTurn ? 'Your turn' : 'Opponent thinking...'}`}
          </p>
          <button
            onClick={resetGame}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {winner==='X' ? 'Play Again' : (winner==='O' || isDraw(board)) ? 'Retry' : 'New Game'}
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
              Here&apos;s your {currentDiscountTier}% discount coupon code from <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">Myntra</a>:
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-center text-gray-600 mb-3">Share your win:</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => shareToSocialMedia('twitter')}
                  className="p-2 cursor-pointer rounded-full bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
                  title="Share on Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                
                <button
                  onClick={() => shareToSocialMedia('facebook')}
                  className="p-2 cursor-pointer rounded-full bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button
                  onClick={() => shareToSocialMedia('whatsapp')}
                  className="p-2 cursor-pointer rounded-full bg-[#25D366] text-white hover:bg-[#22c35e] transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>

                <button
                  onClick={() => shareToSocialMedia('telegram')}
                  className="p-2 cursor-pointer rounded-full bg-[#0088cc] text-white hover:bg-[#0077b3] transition-colors"
                  title="Share on Telegram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://www.myntra.com', '_blank')}
                className="flex-1 cursor-pointer bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Shop Now 🛍️
              </button>
            </div>

            <button
              onClick={() => setShowReward(false)}
              className="w-full mt-4 cursor-pointer bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showLoseModal}
        onClose={() => setShowLoseModal(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-xl p-8 max-w-md mx-auto transform transition-all scale-95">
            <Dialog.Title className="text-2xl font-bold text-center mb-4 text-red-500">
              😅 Game Over! 😅
            </Dialog.Title>
            <Dialog.Description className="text-center mb-6">
              Better luck next time! Want to try again?
            </Dialog.Description>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowLoseModal(false);
                  resetGame();
                }}
                className="flex-1 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowLoseModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-xl p-8 max-w-md mx-auto transform transition-all scale-100">
            <Dialog.Title className="text-2xl font-bold text-center mb-4 text-yellow-500">
              🤝 It's a Draw! 🤝
            </Dialog.Title>
            <Dialog.Description className="text-center mb-6">
              Good game! Ready for another round?
            </Dialog.Description>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDrawModal(false);
                  resetGame();
                }}
                className="flex-1.5 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => setShowDrawModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TicTacToe; 