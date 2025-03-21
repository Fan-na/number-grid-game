import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const NumberGrid = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState(new Set());
  const [gridSize, setGridSize] = useState(5); // 新增：网格大小控制
  const [showSettings, setShowSettings] = useState(false); // 新增：设置面板控制

  // 生成随机数字网格
  const generateRandomGrid = () => {
    const totalCells = gridSize * gridSize;
    const nums = Array.from({ length: totalCells }, (_, i) => i + 1);
    
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

  // 处理数字点击
  const handleNumberClick = (number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(new Date());
    }
    
    if (number === currentNumber) {
      const newClickedNumbers = new Set(clickedNumbers);
      newClickedNumbers.add(number);
      setClickedNumbers(newClickedNumbers);
      
      if (currentNumber === gridSize * gridSize) {
        setEndTime(new Date());
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    } else {
      // 错误点击效果
      const button = document.getElementById(`number-${number}`);
      button.classList.add('bg-red-500');
      setTimeout(() => {
        button.classList.remove('bg-red-500');
      }, 200);
    }
  };

  // 计算完成时间
  const calculateTime = () => {
    if (startTime && endTime) {
      const timeDiff = (endTime - startTime) / 1000;
      const minutes = Math.floor(timeDiff / 60);
      const seconds = Math.floor(timeDiff % 60);
      return `${minutes}分${seconds}秒`;
    }
    return null;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">数字顺序挑战</h1>
      
      {/* 设置按钮 */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showSettings ? '隐藏设置' : '显示设置'}
      </button>

      {/* 设置面板 */}
      {showSettings && (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <label className="block mb-2">
            网格大小：
            <select 
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="ml-2 p-1 border rounded"
            >
              {[3,4,5,6,7,8].map(size => (
                <option key={size} value={size}>{size}x{size}</option>
              ))}
            </select>
          </label>
          <button 
            onClick={generateRandomGrid}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            重新开始
          </button>
        </div>
      )}

      {/* 游戏状态 */}
      <div className="mb-4 text-center">
        {endTime ? (
          <div>
            <p className="text-xl mb-2">恭喜！完成时间: {calculateTime()}</p>
            <button 
              onClick={generateRandomGrid}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              再来一次
            </button>
          </div>
        ) : (
          <p>
            按顺序点击数字 1 到 {gridSize * gridSize}
            {gameStarted && <span className="ml-2">当前数字: {currentNumber}</span>}
          </p>
        )}
      </div>

      {/* 数字网格 */}
      <div className="w-full max-w-[min(500px,90vw)] aspect-square">
        <div className={`grid gap-1 w-full h-full`} 
             style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {numbers.map((number, index) => (
            <button
              key={index}
              id={`number-${number}`}
              onClick={() => handleNumberClick(number)}
              className={`
                aspect-square flex items-center justify-center
                text-lg sm:text-xl font-bold rounded
                ${clickedNumbers.has(number) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white hover:bg-gray-200'
                }
                transition-all duration-200
                transform hover:scale-105
                shadow-md
              `}
              disabled={endTime !== null || clickedNumbers.has(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* 二维码 */}
      <div className="mt-8">
        <QRCodeSVG 
          value={window.location.href}
          size={128}
          level="L"
          className="mx-auto"
        />
        <p className="text-sm text-gray-600 mt-2">
          扫描二维码分享游戏
        </p>
      </div>
    </div>
  );
};

export default NumberGrid;
