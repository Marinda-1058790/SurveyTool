import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import styles from "./NewSurveyMaker.module.css";
import NewOpenQuestion from "../components/NewOpenQuestion";
import NewMultipleChoiceQuestion from "../components/NewMultipleChoiceQuestion";
import NewDatabaseQuestion from "../components/NewDatabaseQuestion";

function NewSurveyMaker() {
  const [addQuestion, setAddQuestion] = useState(false);
  const [divQuestion, setDivQuestion] = useState([]);
  const [questionListArray, setQuestionListArray] = useState([]);
  const [toggleAnonymous, setToggleAnonymous] = useState(false);

  const navigate = useNavigate()

  function callbackFunction(info) {
    console.log(info);
    setQuestionListArray([...questionListArray, info]);
  }

  function toggleOnOff() {
    setToggleAnonymous((toggleAnonymous) => !toggleAnonymous);
  }

  function addNewQuestion() {
    setAddQuestion((addQuestion) => !addQuestion);
  }

  function addNewOpenQuestion() {
    setDivQuestion([
      ...divQuestion,
      <NewOpenQuestion
        key={Math.random() * 100}
        callbackFunction={callbackFunction}
      />,
    ]);
    addNewQuestion();
  }

  function addNewMultipleChoiceQuestion() {
    setDivQuestion([
      ...divQuestion,
      <NewMultipleChoiceQuestion
        key={Math.random() * 100}
        callbackFunction={callbackFunction}
      />,
    ]);
    addNewQuestion();
  }

  function addDatabaseQuestion() {
    setDivQuestion([
      ...divQuestion,
      <NewDatabaseQuestion
        key={Math.random() * 100}
        callbackFunction={callbackFunction}
      />,
    ]);
    addNewQuestion();
  }

  const saveNewSurvey = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("titleInput"),
      questions: questionListArray,
      anonymous: toggleAnonymous
    };
    console.log(data);

    fetch("http://127.0.0.1:5000/save_new_survey", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        navigate("/vragenlijsten")
      });
  };

  return (
    <div className="small-container">
      <form onSubmit={saveNewSurvey}>
        <div className="header-container pb-3">
          <input
            name="titleInput"
            className={styles.surveyTitleInput}
            placeholder="Nieuwe vragenlijst"
          />
          <hr />
        </div>

        <div className={styles.divQuestion}> {divQuestion} </div>

        <div className="header-container pb-3">
          <section className={styles.newQuestionContainer}>
            <div className={styles.newQuestionContent}>
              <h3>Nieuwe Vraag</h3>
              <p>Kies uit een open, multiple choice of vraag uit de database</p>

            </div>

            <span className={styles.addButton + " " + (addQuestion ? styles.cancelButton : '')} onClick={addNewQuestion}><i className={"fa-solid fa-plus " + styles.plusIcon} ></i></span>

          </section>
          <div className={styles.btnRow}>
            {addQuestion ? (
              <>
                <p className={styles.choiceBtn} onClick={addNewOpenQuestion}>Nieuwe open vraag</p>
                <p className={styles.choiceBtn} onClick={addNewMultipleChoiceQuestion}>
                  Nieuwe multiple choice vraag
                </p>
                <p className={styles.choiceBtn} onClick={addDatabaseQuestion}>
                  Vraag uit de database
                </p>
              </>
            ) : null}
          </div>
          <hr />
          {toggleAnonymous ? (
              <>
                <i
                  style={{color: "green"}}
                  onClick={toggleOnOff}
                  className={`bi bi-toggle-on ${styles.toggleAnonymous}`}
                ></i>
                <p>Anoniem: aan</p>
              </>
            ) : (
              <>
                <i
                  onClick={toggleOnOff}
                  className={`bi bi-toggle-off ${styles.toggleAnonymous}`}
                ></i>
                <p>Anoniem: uit</p>
              </>
            )}
          <div className={styles.btnSaveNewSurvey}>
            <button className={styles.submitBtn} type="submit">
              <span>Opslaan</span>
              <i style={{opacity: 0}} className="fa-sharp fa-regular fa-floppy-disk"></i>
              </button>
            
          </div>
        </div>

      </form>
    </div>
  );
}

export default NewSurveyMaker;
