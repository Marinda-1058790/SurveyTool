import { React, useEffect, useState } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./QuestionItem.module.css";

// export default function QuestionItem(vragenlijst) {

const QuestionItem = (data) => {

    const [isEdit, setIsEdit] = useState(false);
    const [question, setQuestion] = useState(data.question.question_text);

    const handleChange = (event) => {
        setQuestion(event.target.value);
    }
    const { id } = useParams();
    const navigate = useNavigate();
    const [choices, setChoices] = useState([]);
    


    const choiceChange = (e, index) =>{
        let cache = choices
        cache[index].choice = e.target.value
        setChoices(cache)
    }
    
    const handleClick = async () => {
        async function updateQuestion() {

            let info = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    question: question
                })
            }

            try {
                const res = await fetch("http://127.0.0.1:5000/question/edit/" + data.question.question_id, info)
                console.log(await res.json())

            }
            catch (error) {
                console.error("QUESTIONS", error)
            }

            
            
        }
        
        if(data.question.type==1){

            let info = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    choices: choices
                })
            }

            try {
                const res = await fetch("http://127.0.0.1:5000/question/multiplechoice/edit", info)
                console.log(await res.json())

            }
            catch (error) {
                console.error("QUESTIONITEM", error)
            }
        }
        updateQuestion()
        toggle()
        data.fetchSurvey()
    }

    function toggle() {
        setIsEdit((isEdit) => !isEdit);
        console.log(data.question)
        if(data.question.type == 1){
            let i = 0
            let choiceArray = []
            for(let choice of data.question.choices){
                choiceArray.push({
                    index: i,
                    choice: choice.answer,
                    id: choice.multiple_choice_id
                })
                i++
            }
            console.log(choiceArray)
            setChoices(choiceArray)
        }
    }

    function moveQuestion(movement){
        data.moveQuestion(movement, data.question.sequence, data.question.question_id)
    }

    function deleteQuestion() {
        let info = {
            method: "DELETE",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }

        console.log(data.question.question_id)
        console.log(data.id)

        fetch("http://127.0.0.1:5000/question/delete/" + data.question.question_id, info).then(()=>{
            // change sequence of items above deleted question with -1
            let info = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    survey_id: id,
                    deleted_sequence: data.question.sequence
                })
                
            }
            fetch("http://127.0.0.1:5000/survey/updateSequence/"+ data.id, info).then(()=>{
                data.fetchSurvey()

            })
           
        })
    }

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionTop}>
                <div className={styles.actionIcons}>
                    <p className={styles.sequence}>{data.question.sequence}</p>

                    {isEdit
                        ?
                        <>
                            <textarea className={styles.textarea} onChange={handleChange} value={question} rows="1"></textarea>
                            <button className={styles.save} onClick={handleClick}>
                                <i className={"fa-solid fa-check"}></i>
                            </button>
                            <button className={styles.cancel} onClick={toggle}>
                                <i className={"fa-solid fa-xmark"}></i>
                            </button>
                        </>
                        : <h3>{question}</h3>
                    }
                </div>
                <div className={styles.actionIcons}>
                    <i onClick={toggle} className={"fa-sharp fa-solid fa-pen-to-square " + styles.editIcon}></i>
                    <i onClick={deleteQuestion} className={"fa-sharp fa-solid fa-trash " + styles.deleteIcon}></i>
                </div>

            </div>
            <div className={styles.questionContent}>
                <p className={styles.label}>{data.question.type ? "Multiple choice" : "Open vraag"}</p>
                {data.question.type ?
                    <div className={styles.questionChoices}>
                        { !isEdit
                        ?
                        data.question.choices.map((choice) => (
                            <p key={choice.multiple_choice_id} className={styles.questionChoice}>{choice.number}. {choice.answer}</p>
                        ))
                        :
                        data.question.choices.map((choice, index) => (
                            <input key={choice.multiple_choice_id} className={styles.textarea} defaultValue={choice.answer} onChange={(e) => choiceChange(e, index)}></input>
                        ))
                        }
                       

                    </div>
                    : ""
                }
            </div>
            <div className={styles.moveContainer}>
                {data.question.sequence == 1
                ?
                    <i onClick={() => moveQuestion(1)} className={"fa-solid fa-chevron-down " + styles.moveItem}></i>
                : data.question.sequence == data.survey.questions.length ?
                    <i onClick={() => moveQuestion(-1)} className={"fa-solid fa-chevron-up " + styles.moveItem}></i>
                :
                <>
                    <i onClick={() => moveQuestion(-1)} className={"fa-solid fa-chevron-up " + styles.moveItem}></i>
                    <i onClick={() => moveQuestion(1)} className={"fa-solid fa-chevron-down " + styles.moveItem}></i>
                </>
                }

            </div>
        </div>



    )
}

export default QuestionItem;







