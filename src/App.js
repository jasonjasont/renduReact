import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
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
    onPlay(nextSquares);

  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner.winner ? winner.winner + ' a gagné' : 'Dommage personne a gagné !';
  } else {
    status = 'Prochain tour : ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinningSquare={winner && winner.line.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinningSquare={winner && winner.line.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinningSquare={winner && winner.line.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinningSquare={winner && winner.line.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinningSquare={winner && winner.line.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinningSquare={winner && winner.line.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinningSquare={winner && winner.line.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinningSquare={winner && winner.line.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinningSquare={winner && winner.line.includes(8)} />
      </div>
    </>
  );
}

export default function Game() {
  
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([0, 0]);

  useEffect(() => {
    setGameStarted(false);
  }, []);

  function handleQuit() {
    setGameStarted(false);
    setScores([0, 0]); 
  }

  function handleStart(player1, player2) {
    setPlayers([player1, player2]);
    setGameStarted(true);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  
    const result = calculateWinner(nextSquares);
    if (result && result.winner) {
      const newScores = [...scores];
      newScores[result.winner === 'X' ? 0 : 1] += 1;
      setScores(newScores);
    }
  }
  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
   
  }
  

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  

 

  const moves = history.map((step, move) => {
    const description = move ?
      'Go to move #' + move + ' (' + step.location + ')' :
      'Go to game start';

    const isCurrentMove = history.length - 1 === move;

    return (
      <li key={move}>
        {isCurrentMove ? (
          <div>Vous êtes au coup #{move}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>

        )}

      </li>
    );
  });
  if (!isAscending) {
    moves.reverse();
  }

  const currentPlayer = xIsNext ? players[0] : players[1];
  const winner = calculateWinner(currentSquares);

  return gameStarted ? (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>Score : {players[0]} - {scores[0]} | {players[1]} - {scores[1]}</div>
        {winner && <button onClick={handleRestart}>Restart</button>}
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Tri décroissant' : 'Tri croissant'}
        </button>
        <button onClick={handleQuit}>Quitter</button>
        <ol>{moves}</ol>
      </div>
    </div>
  ) : (
    <Welcome onStart={handleStart} />
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return squares.includes(null) ? null : { winner: null, line: [] };
}

function calculateLocation(i) {
  const row = Math.floor(i / 3) + 1;
  const col = (i % 3) + 1;
  return `(${row}, ${col})`;
}




function Welcome({ onStart }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [error, setError] = useState(false);

  function handleStart() {
    if (player1 && player2) {
      onStart(player1, player2);
    } else {
      setError(true);
    }
  }

  return (
    <div>
      <h1>Bienvenue</h1>
      <p>Veuillez entrer le nom des deux joueurs :</p>
      <input
        type="text"
        placeholder="Joueur 1"
        value={player1}
        onChange={e => setPlayer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Joueur 2"
        value={player2}
        onChange={e => setPlayer2(e.target.value)}
      />
      <button onClick={handleStart}>Commencer</button>
      {error && <p style={{ color: 'red' }}>Veuillez entrer le nom des deux joueurs.</p>}
    </div>
  );
}

