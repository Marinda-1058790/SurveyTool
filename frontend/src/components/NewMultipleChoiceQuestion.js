import React, { useState } from "react";
import styles from "./NewMultipleChoiceQuestion.module.css";

function NewMultipleChoiceQuestion(props) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([])
  const [dbOptions, setDbOptions] = useState(props.options);
  const [addOption, setAddOption] = useState([
    <div key={Math.random() * 100}>
      <input
        className={styles.inputMultipleChoiceAnswer}
        type="radio"
        disabled
      />
      <input
        className={styles.inputMultipleChoiceAnswer}
        placeholder="Vul hier het antwoord in"
        onBlur={(e) => { setOptions([...options, e.target.value]) }}
      />
      <button className={styles.deleteBtn} onClick={deleteOption}>
        <i className="fa-regular fa-trash-can"></i>
      </button>
    </div>,
  ]);

  let questionInfo = { type: "multiple choice" }
  questionInfo.question = question
  questionInfo.options = options
  props.callbackFunction(questionInfo)

  if (props.value) {
    questionInfo.question = props.value
    questionInfo.options = props.options
    props.callbackFunction(questionInfo)
  }


  function deleteOption(e) {
    const target = e.target
    const optionDiv = target.parentElement.parentElement
    return optionDiv.outerHTML = ""
  }

  function addMultipleChoiceOption() {
    setAddOption([
      ...addOption,
      <div key={Math.random() * 100}>
        <input
          className={styles.inputMultipleChoiceAnswer}
          type="radio"
          disabled
        />
        <input
          className={styles.inputMultipleChoiceAnswer}
          placeholder="Vul hier het antwoord in"
          onBlur={(e) => { setOptions([...options, e.target.value]) }}
        />
        <button className={styles.deleteBtn} onClick={deleteOption}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>,
    ]);
  }

  function deleteFromSurvey(e) {
    const target = e.target
    const outerDiv = target.parentElement.parentElement
    return outerDiv.outerHTML = ""
  }

  return (
    <div 
        className={styles.containerMultipleChoiceQuestion}>
      <div className={styles.header}>
        <h3>Multiple choice vraag</h3>
        <hr className={styles.sectionLine} />
      </div>
      <input
        className={styles.inputMultipleChoiceQuestion}
        placeholder="Vul hier de vraag in"
        value={props.value}
        onBlur={(e) => setQuestion(e.target.value)}
      />
      <div className={styles.divMultipleChoiceOption}>
        {dbOptions ? (
          dbOptions.map((option) => {
            return (
              <div key={Math.random() * 100}>
                <input
                  className={styles.inputMultipleChoiceAnswer}
                  type="radio"
                  disabled
                />
                <input
                  className={styles.inputMultipleChoiceAnswer}
                  value={option}
                />
              </div>
            );
          })
        ) : (
          <>{addOption}</>
        )}
        <p className={styles.addBtn} onClick={addMultipleChoiceOption}>+</p>
      </div>
      <div className={styles.btnMultipleChoiceQuestion}>
        <p className={styles.deleteQuestion} onClick={deleteFromSurvey}>Verwijderen</p>
      </div>
    </div>
  );
}

export default NewMultipleChoiceQuestion;
