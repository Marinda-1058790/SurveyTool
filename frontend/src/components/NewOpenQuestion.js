import React from "react";
import { Button } from "react-bootstrap";
import styles from "./NewOpenQuestion.module.css";

function deleteFromSurvey(e) {
  const target = e.target
  const outerDiv = target.parentElement.parentElement
  return outerDiv.outerHTML = ""
}

function NewOpenQuestion(props) {
  let question = { type: "open" }

  function saveQuestion(e) {
    const value = e.target.value
    question.question = value
    props.callbackFunction(question)
  }

  if (props.value) {
    question.question = props.value
    props.callbackFunction(question)
  }

  return (
    <div className={styles.containerOpenQuestion}>
      <div className={styles.header}>
        <h3>Open vraag</h3>
        <hr className={styles.sectionLine} />
      </div>
      <input
        onBlur={saveQuestion}
        className={styles.inputOpenQuestion}
        placeholder="Vul hier de vraag in"
        value={props.value}
      />
      <div className={styles.btnOpenQuestion}>
        <p className={styles.deleteQuestion} onClick={deleteFromSurvey}>Verwijderen</p>
      </div>
    </div>
  );
}

export default NewOpenQuestion;
