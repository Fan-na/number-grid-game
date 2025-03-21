import { useState, useEffect } from 'react';

const NumberGrid = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState(new Set());

  // 生成1-25的随机数字网格
  const generateRandomGrid = () => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    
    // Fisher-Yates 洗牌算法
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

  // 初始化游戏
  useEffect(() => {
    generateRandomGrid();
  }, []);

  // 处理数字点击
  const handleNumberClick = (number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(new Date());
    }
    
    if (number === currentNumber) {
      // 添加到已点击数字集合
      const newClickedNumbers = new Set(clickedNumbers);
      newClickedNumbers.add(number);
      setClickedNumbers(newClickedNumbers);
      
      if (currentNumber === 25) {
        // 游戏完成
        setEndTime(new Date());
      } else {
        // 前进到下一个数字
        setCurrentNumber(currentNumber + 1);
      }
    }
  };

  // 计算完成时间
  const calculateTime = () => {
    if (startTime && endTime) {
      const timeDiff = (endTime - startTime) / 1000; // 转换为秒
      return timeDiff.toFixed(2);
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">数字顺序挑战</h1>
      <div className="mb-4">
        {endTime ? (
          <div className="text-center">
            <p className="text-xl">恭喜！完成时间: {calculateTime()} 秒</p>
            <button 
              onClick={generateRandomGrid} 
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              再来一次
            </button>
          </div>
        ) : (
          <p className="text-center">
            按顺序点击数字 1 到 25
            {gameStarted && <span className="ml-2">进行中...</span>}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-2 w-full">
        {numbers.map((number, index) => (
          <button
            key={index}
            onClick={() => handleNumberClick(number)}
            className={`
              h-16 w-full flex items-center justify-center text-lg font-bold rounded
              ${clickedNumbers.has(number) ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
            `}
            disabled={endTime !== null || clickedNumbers.has(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberGrid;
