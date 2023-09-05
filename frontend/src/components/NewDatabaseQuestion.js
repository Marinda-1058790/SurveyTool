import { React, useEffect, useState } from "react";
import styles from "./NewDatabaseQuestion.module.css";
import NewOpenQuestion from "./NewOpenQuestion";
import NewMultipleChoiceQuestion from "./NewMultipleChoiceQuestion";

function NewDatabaseQuestion(props) {
  const [questions, setQuestions] = useState([]);
  const [output, setOutput] = useState(0);
  const [newQuestion, setnewQuestion] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      let info = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };

      try {
        const res = await fetch("http://127.0.0.1:5000/question", info);
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("QUESTIONS", error);
      }
    }
    fetchQuestions();
  }, []);

  function clickHandlerDatabaseQuestion(question) {
    setnewQuestion(question.question);
    if (question.options) {
      setOptions(question.options)
    }
    switch (question.type) {
      case 0:
        setOutput(1);
        break;
      case 1:
        setOutput(2);
        break;
      default:
        setOutput(0);
    }
  }

  return (
    <>
      {output === 0 && (
        <div
          key={Math.random() * 100}
          className={styles.containerTableDatabaseQuestion}
        >
          <table className={styles.tableDatabaseQuestion}>
            <thead className={styles.tableHeader}>
              <tr>
                <th><h3>Vragen uit de database</h3></th>
              </tr>
            </thead>
            <hr className={styles.sectionLine}/>
            <tbody>
              {/* <td className={styles.tableBody}> */}
                {questions.map((question) => {
                  return (
                    <tr
                      className={styles.rowQuestion}
                      onClick={() =>
                        clickHandlerDatabaseQuestion(
                          question
                        )
                      }
                      key={question.id}
                    >
        
                      <i class="fa-solid fa-plus"></i> {" "+question.question}
                
                    </tr>
                  );
                })}
              {/* </td> */}
            </tbody>
          </table>
        </div>
      )}
      {output === 1 && <NewOpenQuestion value={newQuestion} callbackFunction={props.callbackFunction}/>}
      {output === 2 && <NewMultipleChoiceQuestion value={newQuestion} options={options} callbackFunction={props.callbackFunction}/>}
    </>
  );
}

export default NewDatabaseQuestion;
