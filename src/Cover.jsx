import React from "react";

export default function Cover({ handleClick }) {
  return (
    <div className="frontpage">
      <h2>Quizzical</h2>
      <p>Start playing this game!</p>
      <button className="frontpage__start-game" onClick={handleClick}>
        Start Quiz
      </button>
    </div>
  );
}
