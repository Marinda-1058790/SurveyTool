import { useEffect, useState } from "react";
import AnswerChart from "./AnswerChart";


const MultipleChoiceAnswers = (data) => {
    const question = data.question
    const [visible, setVisible] = useState(false);

    const chartColors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(100, 205, 86)',
        'rgb(142, 85, 209)',
        'rgb(223, 27, 27)',
        'rgb(221, 134, 200)',
        'rgb(6, 120, 18)',
        'rgb(31, 72, 205)',
        'rgb(219, 131, 10)'

    ]

    useEffect(() => {

    }, [])

    function toggleDetails() {
        setVisible(!visible)
    }

    function getColor() {
        const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
        return `rgb(${randomBetween(0, 255)},${randomBetween(0, 255)},${randomBetween(0, 255)})`; // Collect all to a css color string
    }

    return (
        <div className="bg-light-grey light-shadow">
            <h3 className="question-box"><span className="question-number">{question.sequence}</span>{question.question_text}</h3>
            <p className="label">Multiple choice</p>
            {/* {chartColors.map((color) => (
                <span key={color} style={{ backgroundColor: color }} className="answer-letter">abc</span>
            ))} */}
            <div className="grid-halves">
                <div className="grid-part bg-white justify-center column">
                    <h3>Mogelijke antwoorden</h3>
                    {question.choices.map((choice, i) => (
                        <p key={choice.multiple_choice_id} className="answer-row" ><span style={{ backgroundColor: chartColors[i] }} className="answer-letter">{choice.number.toUpperCase()}</span> {choice.answer}</p>
                    ))}
                    <button className="answer-details-btn" onClick={toggleDetails}>
                        Bekijk details
                        <i className={"chevron fa-solid fa-chevron-right " + (visible ? "rotate" : "")}></i>
                    </button>

                    <div className={"answer-details " + (visible ? "show" : "")}>
                        {question.answers.length ?
                            <>
                                {question.answers.map((answer) => (
                                    <div key={answer.answer_id} className="answer-item">
                                        { answer.user.user_id == null
                                        ?
                                        <div className="user-part"><i style={{ backgroundColor: getColor() }} className="fa fa-solid fa-user user-icon"></i>Verborgen</div>

                                        :
                                        <div className="user-part"><i style={{ backgroundColor: getColor() }} className="fa fa-solid fa-user user-icon"></i>{answer.user.first_name} {answer.user.last_name}</div>
                                        }{answer.answer}
                                    </div>
                                ))}
                            </>
                        : "Geen data"}


                    </div>

                </div>

                <div className="grid-part bg-grey">
                    <div>
                        <AnswerChart question={question} colors={chartColors}></AnswerChart>
                    </div>
                </div>
            </div>
        </div>
    )

}



export default MultipleChoiceAnswers