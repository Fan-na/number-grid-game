import { useState, useEffect } from 'react';

const NumberGrid = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState(new Set());

  const generateRandomGrid = () => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setNumbers(nums);
    setCurrentNumber(1);
    setStartTime(null);
    setEndTime(null);
    setGameStarted(false);
    setClickedNumbers(new Set());
  };

  useEffect(() => {
    generateRandomGrid();
  }, []);

  const handleNumberClick = (number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(new Date());
    }
    
    if (number === currentNumber) {
      const newClickedNumbers = new Set(clickedNumbers);
      newClickedNumbers.add(number);
      setClickedNumbers(newClickedNumbers);
      
      if (currentNumber === 25) {
        setEndTime(new Date());
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    }
  };

  const calculateTime = () => {
    if (startTime && endTime) {
      const timeDiff = (endTime - startTime) / 1000;
      return timeDiff.toFixed(2);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">数字顺序挑战</h1>
        <div className="mb-4">
          {endTime ? (
            <div className="text-center">
              <p className="text-lg sm:text-xl">恭喜！完成时间: {calculateTime()} 秒</p>
              <button 
                onClick={generateRandomGrid} 
                className="mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
              >
                再来一次
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm sm:text-base mb-1">按顺序点击数字 1 到 25</p>
              {gameStarted && <p className="text-sm text-blue-600">当前数字: {currentNumber}</p>}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {numbers.map((number, index) => (
            <button
              key={index}
              onClick={() => handleNumberClick(number)}
              className={`
                aspect-square w-full flex items-center justify-center
                text-base sm:text-lg font-bold rounded-lg
                transition-colors duration-200
                ${clickedNumbers.has(number) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white hover:bg-gray-100 active:bg-gray-200 shadow-sm'}
              `}
              disabled={endTime !== null || clickedNumbers.has(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberGrid;