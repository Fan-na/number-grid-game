import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const NumberGrid = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState(new Set());

  // ... 其他函数保持不变 ...

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">数字顺序挑战</h1>
      
      {/* 二维码部分 */}
      <div className="mb-4">
        <QRCodeSVG 
          value={window.location.href}
          size={128}
          level="L"
          className="mx-auto"
        />
        <p className="text-sm text-gray-600 mt-2 text-center">
          扫描二维码分享游戏
        </p>
      </div>

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
      
      {/* 关键修改：使用aspect-square确保宽高比1:1，并限制最大宽度 */}
      <div className="w-full max-w-[500px] aspect-square">
        <div className="grid grid-cols-5 gap-1 h-full w-full">
          {numbers.map((number, index) => (
            <button
              key={index}
              onClick={() => handleNumberClick(number)}
              className={`
                aspect-square flex items-center justify-center text-lg md:text-xl font-bold rounded
                ${clickedNumbers.has(number) ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                transition-colors duration-200
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
