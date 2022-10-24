import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  let classNameValue = "square"
  if(props.color){
    classNameValue += " color"
  }
  return (
    <button className={classNameValue} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, color = false) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        color= {color}
      />
    );
  }

  render() {
    var indenets = []
    for(var row = 0; row < this.props.size; row++){
      var col_content = []
      for(var col=0; col < this.props.size; col++){
        let index = row * this.props.size + col
        if(Array.isArray(this.props.winner) === false)
          col_content.push(this.renderSquare(index))
        else{
          if(this.props.winner.includes(index) === false){
            col_content.push(this.renderSquare(index))
          }
          else{
            col_content.push(this.renderSquare(index, true))
          }
        }
      }
      indenets.push(<div className="board-row">{col_content}</div>)
    }
    return (
      <div>
        {indenets}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 3,
      history: [
        {
          squares: Array(() => this.state.size**2).fill(null),
          index: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      order: "Ascending",
      style: "normal",
      lines: []
    };
    
    let winningLine = []
    for(let row = 0; row < this.state.size; row++){
      let rowValue = []
      for(let col = 0; col < this.state.size; col++){
        rowValue.push(row * this.state.size + col)
      }
      winningLine.push(rowValue)
    }

    for(let col = 0; col < this.state.size; col++){
      let colValue = []
      for(let row = 0; row < this.state.size; row++){
        colValue.push(row * this.state.size + col)
      }
      winningLine.push(colValue)
    }

    let rowValue = []
    for(let row = 0; row < this.state.size; row++){
      rowValue.push(row * this.state.size + row)
    }
    winningLine.push(rowValue)

    rowValue = []
    for(let row = 0; row < this.state.size; row++){
      rowValue.push(row * this.state.size + this.state.size - (row + 1)) 
    }
    winningLine.push(rowValue)

    this.state.lines = winningLine
    console.log(winningLine)
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares, this.state.lines)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          index: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      style: "normal"
    });
  }

  handleOrderClick(){
    this.setState({
      order: this.state.order === "Descending" ? "Ascending" : "Descending" 
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      style: {
        [step]: "selected" 
      }
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.lines);

    let moves = history.map((step, move) => {
      const col = step.index % this.state.size;
      const row = Math.floor(step.index / this.state.size)
      const desc = move ?
        'Go to move #' + move +": {"+ row  +","+col+"}" :
        'Go to game start';
      return (
        <li key={move} >
          <button onClick={() => this.jumpTo(move)} className={this.state.style[move] || ""}>
            {desc}
          </button>
        </li>
      );
    });

    if(this.state.order === "Descending"){
      moves.reverse()
    }

    let status;
    if (winner === "Draw"){
      status = "Draw"
    } else if (winner){
      status = "Winner: " + current.squares[winner[0]];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            size={this.state.size}
            winner={winner}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>

        <div>
          <button onClick={() => this.handleOrderClick()}>
              {this.state.order}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares, lines) {
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i][0];
    let win = false
    if(squares[a] === null || squares[a] === undefined) continue
    for(let j = 1; j< lines[i].length; j++){
      if(squares[a] !== squares[lines[i][j]])
        {
          win = false
          break
        }
        win = true
    }
    if(win)
      return lines[i]
  }
  if(squares.includes(null) === false && squares.includes(undefined) === false)
    return "Draw"
  return null;
}

