import { useEffect, useState } from "react";
import Cover from "./Cover";
import { nanoid } from "nanoid";
import { encode, decode } from "html-entities";

function App() {
  const [screen, setScreen] = useState("screen1");
  const [apiData, setApiData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [error, setError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function getQuestions() {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=19&difficulty=medium&type=multiple"
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
        question: decode(entry.question),
        choices: shuffleChoices(entry),
        answer: entry.correct_answer,
      };
    });
    setFormData((prev) => data);
  }, [apiData]);

  function shuffleChoices(entry) {
    let choices = entry.incorrect_answers.map((entry) => {
      return { name: entry, status: "" };
    });
    choices.splice(Math.floor(Math.random() * 4), 0, {
      name: entry.correct_answer,
      status: "",
    });
    return choices;
  }

  function submitForm(e) {
    e.preventDefault();
    setFormSubmitted(true);

    let gameScore = score;
    formData.forEach((item) => {
      gameScore = item.checked === item.answer ? gameScore + 1 : gameScore;
    });
    setFormData((prevData) => {
      return prevData.map((item) => {
        console.log(item);
        if (item.checked === item.answer) {
          return {
            ...item,
            choices: [
              ...item.choices.map((choice) => {
                return {
                  name: choice.name,
                  status: choice.name === item.answer ? "green" : "",
                };
              }),
            ],
          };
        } else {
          return {
            ...item,
            choices: [
              ...item.choices.map((choice) => {
                let colorStatus = "";
                if (choice.name === item.checked) colorStatus = "red";
                else if (choice.name == item.answer) {
                  colorStatus = "green";
                }
                return {
                  name: choice.name,
                  status: colorStatus,
                };
              }),
            ],
          };
        }
      });
    });
    setScore(gameScore);
  }

  const questions = formData.map((item) => {
    return (
      <li key={item.id} id={item.id}>
        <legend>
          <h5>{item.question}</h5>
        </legend>
        {choiceElements(item.id, item.checked, item.choices)}
      </li>
    );
  });

  function choiceElements(id, checked, choices) {
    return choices.map((item) => {
      return !formSubmitted ? (
        <>
          <label className={item.status + " custom-radio"} htmlFor={item.name}>
            <input
              type="radio"
              name={id}
              value={item.name}
              checked={checked === item.name}
              onChange={handleFormChange}
            />
            <span class="custom-radio-button"></span>
            {item.name}
          </label>
        </>
      ) : (
        <>
          <label className={item.status + " custm-radio"} htmlFor={item.name}>
            <input
              type="radio"
              name={id}
              value={item.name}
              checked={checked === item.name}
              onChange={handleFormChange}
            />
            <span class="custom-radio-button"></span>
            {item.name}
          </label>
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
        {screen === "screen1" && <Cover handleClick={getQuestions} />}
        {screen === "screen2" && (
          <form onSubmit={submitForm} className="questionaire">
            <fieldset>
              <ul>{questions}</ul>
            </fieldset>
            {formSubmitted ? (
              <>
                <p>
                  Score: {score} / {formData.length}
                </p>
                <button onClick={getQuestions}>Play Again</button>
              </>
            ) : (
              <button className="frontpage__start-game">Submit</button>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
