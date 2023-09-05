import { React, useState } from "react";
import styles from "./NewQuestionItem.module.css";


const NewQuestionItem = (data) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isAbcd, setIsAbcd] = useState(false);
    const [title, setTitle] = useState("");
    const [index, setIndex] = useState(0);
    const [choices, setChoices] = useState([{index: 0, choice: ""}]);
    const [isNewQuestion, setIsNewQuestion] = useState(true);

    const handleChange = (event) => {
        setTitle(event.target.value);
    }

    const choiceChange = (e, index) =>{
        let cache = choices
        cache[index].choice = e.target.value
        setChoices(cache)
    }

    function addMultipleChoiceOption() {
        // First adjust index
        let i = index+1
        setChoices([...choices, {index: i, choice: ""}])
        setIndex(i)
    }

    const handleClick = () => {
        async function saveQuestion() {

            let info = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    question: title,
                    sequence: data.sequence
                })
            }

            try {
                const res = await fetch("http://127.0.0.1:5000/add_open_question_to_survey/" + data.survey_id, info)
                console.log(await res.json())

            }
            catch (error) {
                console.error("QUESTIONS", error)
            }

        }
        saveQuestion()
        data.fetchSurvey()
        setIsNewQuestion(false)
    }

    const handleClickMc = (e) => {
        console.log("LAST",  choices)
        async function saveQuestion() {

            let info = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                    question: title,
                    sequence: data.sequence,
                    answers: choices
                })
            }

            try {
                const res = await fetch("http://127.0.0.1:5000/add_mc_question_to_survey/" + data.survey_id, info)
                console.log(await res.json())

            }
            catch (error) {
                console.error("QUESTIONS", error)
            }

        }
        saveQuestion()
        data.fetchSurvey()
        setIsNewQuestion(false)
    }

    function toggle(type) {
        setIsNewQuestion(true)
        if (type == "open") {
            setIsAbcd(false);
        }
        else {
            setIsAbcd(true);
        }
    }

    return (
        <>
            <div className={styles.choiceContainer}>
                <button className={styles.choiceBtn + " " + (!isAbcd ? styles.active : "")} onClick={() => toggle("open")} >Openvraag</button>
                <button className={styles.choiceBtn + " " + (isAbcd ? styles.active : "")} onClick={() => toggle("abcd")} >Multiple choice</button>
            </div>
            {isNewQuestion &&
                <>
                    {isAbcd ?
                        <div className={styles.newQuestionCard}>
                            <p className={styles.inputLabel}>Vraag:</p>
                            <input className={styles.mainInput} placeholder="Vraag" onChange={handleChange} value={title} >
                            </input>
                            <div className={styles.subInputs}>
                                {choices.map((choice) => (
                                    <input key={choice.index} placeholder="Vul hier een antwoord in" onChange={(e) => choiceChange(e, choice.index)}></input>
                                ))}
                                <button className={styles.addBtn} onClick={addMultipleChoiceOption}>+</button>
                            </div>
                            <button className={styles.saveBtn} onClick={handleClickMc}>Opslaan</button>

                        </div>
                        :
                        <div className={styles.newQuestionCard}>
                            <p className={styles.inputLabel}>Vraag:</p>
                            <input className={styles.mainInput} placeholder="Vraag" onChange={handleChange} value={title} >
                            </input>

                            <div>
                                <button className={styles.saveBtn} onClick={handleClick}>Opslaan</button>
                            </div>

                        </div>
                    }
                </>
            }

        </>

    )

}



export default NewQuestionItem