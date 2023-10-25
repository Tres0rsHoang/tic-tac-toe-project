import { useState } from 'react';
import "./App.css";

function Square({ value, onSquareClick, onWin = false}) {
  if (onWin) {
    return (
      <button className="square" onClick={onSquareClick} style={{backgroundColor: 'Yellow'}}>
        <div>{value}</div>
      </button>
    );
  }  
  return (
    <button className="square" onClick={onSquareClick}>
      <div>{value}</div>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner[0];
  }
  if (!squares.includes(null)) {
    status = 'Game Draw';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  var board = [];  

  if (winner) {
    board = [];
    const line = winner.slice(1)[0];
    for (var i = 0; i < 3; i++) {
      var row = [];
      for (var j = 0; j < 3; j++){
        const index = i*3 + j;
        if (line.includes(index)) {
          row.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} onWin = {true}/>)
        }
        else {
          row.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} />)
        }
      }
      board.push(<div className="board-row">{row}</div>);
    }
  }
  else {
    for (i = 0; i < 3; i++) {
      row = [];
      for (j = 0; j < 3; j++){
        const index = i * 3 + j;
        row.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} />)
      }
      board.push(<div className="board-row">{row}</div>);
    }
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);


  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextMoveHistory = [...moveHistory.slice(0, currentMove + 1), index];

    setHistory(nextHistory);
    setMoveHistory(nextMoveHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((square, move) => {
    let description;
    if (move > 0) {
      description = 'You are at move #' + move;
      return (
        <li key={move}>
          <div>{description}</div>
        </li>
      );
    }
    else return (
      <div></div>
    )
  });

  const movesHistory = moveHistory.map((index) => {
    const row = (index - (index % 3)) / 3;
    const collumn = index % 3;
    return (
      <div>({row}, {collumn})</div>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>Move count:</div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>Move history:</div>
      <div className="move-history">
        <ol>{movesHistory}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

