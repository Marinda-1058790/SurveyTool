import { React, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import QuestionItem from "../components/QuestionItem";
import NewQuestionItem from "../components/NewQuestionItem";
import styles from "./AdjustEnquete.module.css";
import Loader from "../components/Loader";

function AdjustEnquete() {
    const [loading, setLoading] = useState(true)
    const [isAdd, setIsAdd] = useState(false);

    function toggle() {
        setIsAdd((isAdd) => !isAdd);
    }

    const [survey, setSurvey] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    function moveQuestion(movement, sequence, id) {
        let changes = []
        if (movement == -1) {
            // moving up

            // get index of item above
            var index = survey.questions.findIndex(p => p.sequence == (sequence - 1));
            let selfSequence = sequence
            let otherSequence = survey.questions[index].sequence
            let otherId = survey.questions[index].question_id
            let newSelfSequence = selfSequence - 1
            let newOtherSequence = otherSequence + 1
            changes = [
                {
                    question_id: id,
                    new_sequence: newSelfSequence
                },
                {
                    question_id: otherId,
                    new_sequence: newOtherSequence
                }
            ]



        } else {
            // moving down
            // get index of item under
            var index = survey.questions.findIndex(p => p.sequence == (sequence + 1));
            let selfSequence = sequence
            let otherSequence = survey.questions[index].sequence
            let otherId = survey.questions[index].question_id
            let newSelfSequence = selfSequence + 1
            let newOtherSequence = otherSequence - 1
            changes = [
                {
                    question_id: id,
                    new_sequence: newSelfSequence
                },
                {
                    question_id: otherId,
                    new_sequence: newOtherSequence
                }
            ]
        }

        let info = {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            body: JSON.stringify(changes)
        }

        try {
            fetch("http://127.0.0.1:5000/survey/changeSequence/" + id, info).then((res) => {
                console.log(res.json())
                fetchSurvey()
            })


        }
        catch (error) {
            console.error("QUESTIONS", error)
        }


    }

    async function fetchSurvey() {
        setLoading(true)
        let info = {
            method: "GET",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }

        try {
            const res = await fetch("http://127.0.0.1:5000/survey/data/" + id, info)
            const data = await res.json()
            console.log(data)
            setSurvey(data)
            setIsAdd(false)
            setLoading(false)
            if (!data.questions?.length) {
                console.error("No data")
                navigate("/404", { replace: true })
            }

            return data

        }
        catch (error) {
            console.error("QUESTIONS", error)
        }

    }
    useEffect(() => {

        fetchSurvey()

    }, [])



    return (
        <>
            <div className="secondary-nav">
                <NavLink to={"/vragen/" + id} className={({ isActive, isPending }) => isPending ? "secondary-nav-item" : isActive ? "secondary-nav-item active" : "secondary-nav-item"}
                >Vragen</NavLink>
                <NavLink to={"/antwoorden/" + id} className={({ isActive, isPending }) => isPending ? "secondary-nav-item" : isActive ? "secondary-nav-item active" : "secondary-nav-item"}
                >Antwoorden</NavLink>
            </div>
            {loading &&
                <Loader></Loader>

            }
            <div className="small-container">
                <div className="header-container pb-3">
                    <h2 className="mb-0">{survey.name}</h2>
                    <hr />
                    {/* Add the card to create a new vragenlijst */}
                    <section className={styles.newQuestionContainer}>
                        <div className={styles.newQuestionContent}>
                            <h3>Nieuwe Vraag</h3>
                            <p>Kies uit een open of multiple choice vraag</p>

                        </div>

                        <button className={styles.addButton + " " + (isAdd ? styles.cancelButton : '')} onClick={toggle}><i className={"fa-solid fa-plus " + styles.plusIcon} ></i></button>

                    </section>

                    {isAdd &&
                        <NewQuestionItem survey_id={id} fetchSurvey={fetchSurvey} sequence={survey.questions.length + 1}></NewQuestionItem>
                    }
                </div>

                <div className="flex-gap">
                    {/* Render the other cards */}
                    {survey.questions?.map((vragenlijst) => (
                        <QuestionItem key={vragenlijst.question_id} id={vragenlijst.survey_id} question={vragenlijst} survey={survey} moveQuestion={moveQuestion} fetchSurvey={fetchSurvey}> </QuestionItem>
                    ))}

                    <div className={styles.btnSaveNewSurvey}>
                        <Link to="/vragenlijsten">
                            <button className={styles.submitBtn} type="submit">
                                <span>Terug</span>
                                <i style={{ opacity: 0 }} className="fa-solid fa-reply"></i>
                            </button>
                        </Link>

                    </div>

                </div>

            </div>
        </>
    );
}





export default AdjustEnquete;
