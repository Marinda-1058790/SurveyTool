import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Loader from "../components/Loader";
import styles from "./SurveyForm.module.css";

const SurveyForm = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [surveyData, setSurveyData] = useState({ surveyName: '', questions: [] });
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    setLoading(true)
    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:5000/survey/data/${id}`, {
      headers: {
        'Authorization': "Bearer " + token
      }
    })
    .then(response => {
      console.log(response)
      return response.json();
    })
    .then(data => {
      setSurveyData({
        surveyName: data.name,
        questions: data.questions
      });
      setLoading(false)
    })
    .catch(error => console.error('Error:', error));
  }, [id]);

  const handleChange = (id, answer) => {
    let item = { question_id: id, answer: answer, user_id: user.user_id };
    let newAnswers = [...answers];
    let index = newAnswers.map(e => e.question_id).indexOf(id);
    console.log(index)
    if(index != -1){
      if (answer.trim() === '') {
        newAnswers.splice(index, 1);
      } else {
        newAnswers[index].answer = answer;
      }
    } else {
      newAnswers.push(item);
    }
    setAnswers(newAnswers);
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user)
    const surveySubmission = {
      survey_id: id,
      user_id: user.user_id,
      answers,
    };

    console.log("Submitting survey submission:", surveySubmission);

    const token = sessionStorage.getItem('token');
    fetch('http://localhost:5000/survey/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(surveySubmission),
    })
    .then(response => {
      console.log(response)
      return response.json();
    })
    .then(data => {
      console.log(data);
      setMessage("Bedankt voor het invullen van de vragenlijst, u wordt nu doorgestuurd naar de homepage.");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleNextPage = () => {
    if (currentPage !== Math.ceil(surveyData.questions.length / questionsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">{surveyData.surveyName}</h1>
      {loading &&
        <Loader></Loader>
      }
      <p>{answers.length} / {surveyData.questions.length} vragen beantwoord.</p>
      <Form onSubmit={handleSubmit}>
        {surveyData.questions.length > 0 ? (
          surveyData.questions
          .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
          .map(question => (
            <Card key={question.question_id} className="mb-4">
              <Card.Body>
                <Card.Title>{question.question_text}</Card.Title>
                {question.type === 1 ? (
                  question.choices.map(choice => (
                    <Form.Check
                      key={`${question.question_id}-${choice.multiple_choice_id}`}
                      type="radio"
                      id={`${question.question_id}-${choice.multiple_choice_id}`}
                      name={`question-${question.question_id}`}
                      label={`${choice.number}. ${choice.answer}`}
                      checked={answers.find(a => a.question_id === question.question_id)?.answer === choice.number}
                      onChange={() => handleChange(question.question_id, choice.number)}
                    />
                  ))
                ) : (
                  <Form.Control 
                    type="text" 
                    placeholder="Antwoord" 
                    value={answers.find(a => a.question_id === question.question_id)?.answer || ''} 
                    onChange={(e) => handleChange(question.question_id, e.target.value)} 
                  />
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Geen vragen gevonden</p>
        )}
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
      <div className="d-flex justify-content-center">
      <i className={`fa-sharp fa-solid fa-chevron-left ${styles.chevronIcon} ${currentPage === 1 ? styles.disabledIcon : ""}`} onClick={handlePrevPage}></i>
      <p>{currentPage} of {Math.ceil(surveyData.questions.length / questionsPerPage)}</p>
      <i className={`fa-sharp fa-solid fa-chevron-right ${styles.chevronIcon} ${currentPage === Math.ceil(surveyData.questions.length / questionsPerPage) ? styles.disabledIcon : ""}`} onClick={handleNextPage}></i>
      </div>
      {message && (
        <div className="alert alert-success mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default SurveyForm;
