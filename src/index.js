import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = props.focus ? 'square focus' : 'square'
  return (
    <button className={className} onClick={props.onClick}>{props.value}</button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const focus = this.props.lastPos === i
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        focus={focus}
      />
    )
  }

  render() {
    const rows = []
    for (let row = 0; row < 3; row++) {
      const cols = []
      for (let col = 0; col < 3; col++) {
        cols.push(this.renderSquare(row * 3 + col))
      }
      rows.push(<div className="board-row" key={row}>{cols}</div>)
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      orderIsAsc: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares,
        pos: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleOrder() {
    this.setState({
      orderIsAsc: !this.state.orderIsAsc,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const pos = step.pos
      const col = pos % 3 + 1
      const row = Math.floor(pos / 3) + 1
      const desc = move ? `Go to move #${move}: (${col}, ${row})` : 'Go to game start'
      const dom = this.state.stepNumber === move
        ? <b>{desc}</b>
        : <span>{desc}</span>
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{dom}</button>
        </li>
      )
    })

    if (!this.state.orderIsAsc) {
      moves.reverse()
    }

    let status = winner
      ? 'Winner: ' + winner
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    const lastPos = winner ? current.pos : null

    if (history.length === 10 && !winner) {
      status = 'This game is draw!'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
            lastPos={lastPos}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleOrder()}>Toggle Order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
