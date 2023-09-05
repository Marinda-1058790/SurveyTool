import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Answers.css";
import React from 'react'
import MultipleChoiceAnswers from "../components/MultipleChoiceAnswers";
import Loader from "../components/Loader";

const Answers = () => {
    const [loading, setLoading] = useState(true)
    const [survey, setSurvey] = useState([]);
    const navigate = useNavigate();

    let { id } = useParams();

    function getColor() {
        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
        return `rgb(${randomBetween(0, 255)},${randomBetween(0, 255)},${randomBetween(0, 255)})`; // Collect all to a css color string
    }


    // const id = 1

    useEffect(() => {
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
                setLoading(false)
                if(!data.questions.length){
                    console.error("No data")
                    navigate("/404" , { replace: true })
                }

                return data

            }
            catch (error) {
                console.error("QUESTIONS", error)
            }

        }
        fetchSurvey()

    }, [])



    return (
        <section>
            <div className="secondary-nav">
                <NavLink to={"/vragen/"+id} className={({ isActive, isPending }) => isPending ? "secondary-nav-item" : isActive ? "secondary-nav-item active" : "secondary-nav-item"}
                >Vragen</NavLink>
                <NavLink to={"/antwoorden/"+id} className={({ isActive, isPending }) => isPending ? "secondary-nav-item" : isActive ? "secondary-nav-item active" : "secondary-nav-item"}
                >Antwoorden</NavLink>
            </div>
            {loading &&
            <Loader></Loader>

            }
            <div className="small-container flex-gap">
                <div className="header-container">
                    <h1 className="title">{survey.name}</h1>
                    <div className="gradient-border"></div>
                </div>
                {/* current survey id: {id} */}
                {survey.questions?.map((question) => (
                    <React.Fragment key={question.question_id}>
                        {question.type == 1
                            ?
                            <MultipleChoiceAnswers question={question}></MultipleChoiceAnswers>
                            :
                            <div className="bg-light-grey light-shadow">
                                <h3 className="question-box"><span className="question-number">{question.sequence}</span>{question.question_text}</h3>
                                <p className="label">Open vraag</p>
                                <div className="bg-white answers">
                                    {question.answers.length ?  
                                        <>
                                            {question.answers.map((answer) => (
                                                <div key={answer.answer_id} className="answer-item">
                                                    { answer.user.user_id == null
                                                    ?
                                                    <div className="user-part"><i style={{ backgroundColor: getColor() }} className="fa fa-solid fa-user user-icon"></i>Verborgen</div>
                                                    
                                                    :
                                                    <div className="user-part"><i style={{ backgroundColor: getColor() }} className="fa fa-solid fa-user user-icon"></i>{answer.user.first_name} {answer.user.last_name}</div>

                                                    }
                                                    {answer.answer}
                                                </div>
                                            ))}
                                        </>
                                    : "Geen data" }
                                    
                                </div>
                            </div>
                        }

                    </React.Fragment>
                ))}
            </div>
        </section>

    );
};

export default Answers;