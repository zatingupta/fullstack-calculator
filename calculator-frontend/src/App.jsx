import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  };

  const performOperation = (nextOp) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
      setHistory(`${inputValue} ${nextOp}`);
    } else if (operation) {
      handleCalculate(prevValue, inputValue, operation, nextOp);
      return;
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleCalculate = async (num1, num2, op, nextOp = null) => {
    let apiOp = '';
    if (op === '+') apiOp = 'add';
    else if (op === '-') apiOp = 'subtract';
    else if (op === '×' || op === '*') apiOp = 'multiply';
    else if (op === '÷' || op === '/') apiOp = 'divide';

    try {
      const response = await axios.post('http://localhost:5162/api/calculator/calculate', {
        num1: num1,
        num2: num2,
        operation: apiOp
      });

      if (response.data.isSuccess) {
        setDisplay(String(response.data.result));
        if (nextOp) {
          setPrevValue(response.data.result);
          setHistory(`${response.data.result} ${nextOp}`);
          setOperation(nextOp);
        } else {
          setPrevValue(null);
          setHistory(response.data.expression + ' =');
          setOperation(null);
        }
      } else {
        setDisplay(response.data.errorMessage || 'Error');
        setPrevValue(null);
        setOperation(null);
      }
    } catch {
      setDisplay('Server Error');
    }
    setWaitingForOperand(true);
  };

  const onEquals = () => {
    if (operation && prevValue !== null) {
      handleCalculate(prevValue, parseFloat(display), operation);
    }
  };

  return (
    <div className="calc-container">
      <h2>.NET + React Calculator</h2>
      <div className="calculator">
        <div className="calc-screen">
          <div className="calc-history">{history}</div>
          <div className="calc-main">{display}</div>
        </div>
        <div className="calc-keypad">
          <button className="btn btn-action" onClick={clearAll}>AC</button>
          <button className="btn btn-action" onClick={() => setDisplay(String(-parseFloat(display)))}>±</button>
          <button className="btn btn-action" onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</button>
          <button className="btn btn-op" onClick={() => performOperation('÷')}>÷</button>

          <button className="btn" onClick={() => inputDigit(7)}>7</button>
          <button className="btn" onClick={() => inputDigit(8)}>8</button>
          <button className="btn" onClick={() => inputDigit(9)}>9</button>
          <button className="btn btn-op" onClick={() => performOperation('×')}>×</button>

          <button className="btn" onClick={() => inputDigit(4)}>4</button>
          <button className="btn" onClick={() => inputDigit(5)}>5</button>
          <button className="btn" onClick={() => inputDigit(6)}>6</button>
          <button className="btn btn-op" onClick={() => performOperation('-')}>-</button>

          <button className="btn" onClick={() => inputDigit(1)}>1</button>
          <button className="btn" onClick={() => inputDigit(2)}>2</button>
          <button className="btn" onClick={() => inputDigit(3)}>3</button>
          <button className="btn btn-op" onClick={() => performOperation('+')}>+</button>

          <button className="btn btn-zero" onClick={() => inputDigit(0)}>0</button>
          <button className="btn" onClick={inputDot}>.</button>
          <button className="btn btn-equals" onClick={onEquals}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;