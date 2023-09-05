import { useEffect, useState } from "react";
import styles from "../pages/EnqueteOverview.module.css";

const SurveyInfoContainer = (data) => {
    const [questionCount, setQuestionCount] = useState(0);
    const [answerCount, setAnswerCount] = useState(0);
    useEffect(() =>{
        function getSurveyStats(id) {
            fetch('http://localhost:5000/survey/surveyStats/' + id, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    setAnswerCount(data.answerCount)
                    setQuestionCount(data.questionCount)
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
        getSurveyStats(data.id)
    }, [])

return (
    <div className={styles.infoContainer}>
        <p className={styles.infoText}>Vragen: {questionCount}</p>
        <p className={styles.infoText}>Ingevuld: {answerCount}</p>
    </div>
)

}



export default SurveyInfoContainer