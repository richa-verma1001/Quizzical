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
        choices: [
          ...entry.incorrect_answers.map((entry) => {
            return { name: entry, status: "" };
          }),
          { name: entry.correct_answer, status: "" },
        ],
        // choices: [...entry.incorrect_answers, entry.correct_answer],
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
    formData.forEach((item) => {
      gameScore = item.checked === item.answer ? gameScore + 1 : gameScore;
    });
    setFormData((prevData) => {
      return prevData.map((item) => {
        console.log(item);
        if (item.checked === item.answer) {
          // update choice status to green
          // return {...item, item.choices[item.answer].status = "green"};
          // return { ...item, choices: [...item.choices] };
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
          // update choice status to red and highlight right choice
          // item.choices[item.checked].status = "red";
          // item.choices[item.answer].status = "green";
          // return { ...item, choices: [...item.choices] };
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

    console.log(formData);
    setScore(gameScore);
  }

  const questions = formData.map((item) => {
    // const id = nanoid();
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
      // const status = item.status;
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
        {/* <button onClick={getQuestions}>Get Data</button> */}
        {screen === "screen1" && <Cover handleClick={getQuestions} />}
        {screen === "screen2" && (
          <form onSubmit={submitForm} className="questionaire">
            <fieldset>
              <ul>{questions}</ul>
            </fieldset>
            {formSubmitted ? (
              <>
                <p>Score: {score}/5</p>
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
