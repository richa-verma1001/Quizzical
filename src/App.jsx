import { useEffect, useState } from "react";
import Cover from "./Cover";
import { nanoid } from "nanoid";

function App() {
  const [screen, setScreen] = useState("screen1");
  const [apiData, setApiData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function getQuestions() {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=23&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => setApiData(data.results))
      .catch((err) => setError(err));

    setFormSubmitted(false);
    setScreen("screen2");
  }

  useEffect(() => {
    const data = apiData.map((entry) => {
      return {
        id: nanoid(),
        question: entry.question,
        choices: [...entry.incorrect_answers, entry.correct_answer],
        answer: entry.correct_answer,
      };
    });
    setFormData((prev) => data);
  }, [apiData]);

  function submitForm(e) {
    e.preventDefault();
    setFormSubmitted(true);
    console.log(formData);
    let gameScore = score;
    // formData.forEach((item) => {
    //   gameScore = item.checked === item.answer ? gameScore + 1 : gameScore;
    // });

    formData.map((item) => {
      gameScore = item.checked === item.answer ? gameScore + 1 : gameScore;
      // console.log(item);
      // return item.choices.map( (choice) => {

      // })
      return;
    });
    setScore(gameScore);
  }

  const questions = formData.map((item) => {
    // const id = nanoid();
    return (
      <li key={item.id} id={item.id}>
        <legend>{item.question}</legend>
        {choiceElements(item.id, item.checked, item.choices)}
      </li>
    );
  });

  function choiceElements(id, checked, choices) {
    return choices.map((item) => {
      return !formSubmitted ? (
        <>
          <input
            type="radio"
            name={id}
            value={item}
            checked={checked === item}
            onChange={handleFormChange}
          />
          <label htmlFor={item}>{item}</label>
        </>
      ) : (
        <>
          <input
            type="radio"
            name={id}
            value={item}
            checked={checked === item}
            onChange={handleFormChange}
          />
          <label htmlFor={item}>{item}</label>
        </>
      );
    });
  }

  function handleFormChange(e) {
    const { name, value, type } = e.target;
    setFormData((prevData) => {
      return prevData.map((item) => {
        return item.id === name ? { ...item, checked: value } : item;
      });
    });
  }

  return (
    <div className="container">
      <main>
        {/* <button onClick={getQuestions}>Get Data</button> */}
        {screen === "screen1" && <Cover handleClick={getQuestions} />}
        {screen === "screen2" && (
          <form onSubmit={submitForm}>
            <fieldset>
              <ul>{questions}</ul>
            </fieldset>
            {formSubmitted ? (
              <>
                <p>Score: {score}/5</p>
                <button onClick={getQuestions}>Play Again</button>
              </>
            ) : (
              <button>Submit</button>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
