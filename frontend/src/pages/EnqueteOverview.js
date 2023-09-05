import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col, Toast} from "react-bootstrap";
import styles from "./EnqueteOverview.module.css";
import SurveyInfoContainer from "../components/SurveyInfoContainer";
import Loader from "../components/Loader";

function EnqueteOverview() {
  const [vragenlijsten, setVragenlijsten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/surveys', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
      .then(response => response.json())
      .then(data => {
        setVragenlijsten(data);
        setLoading(false)
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  function deleteSurvey(id) {
    console.log("Delete : " + id)
  }
  const handleLinkClick = (id) => {
    const url = `${window.location.origin}/vragenlijst/invullen/${id}`;
    navigator.clipboard.writeText(url);
    showToastNotification(`URL copied to clipboard: ${url}`);
  };

  const showToastNotification = (message) => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <Container className="mt-3">
      <Toast className={styles.toastStyle} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
        <Toast.Body>URL copied to clipboard!</Toast.Body>
      </Toast>
      <div className={styles.headerContainer}>
        <h1>Vragenlijst overzicht</h1>
        <Link to="/vragenlijst/nieuw" style={{ textDecoration: 'none' }}>
          <button className={styles.newButton}><i className={"fa-solid fa-plus " + styles.plusIcon} ></i></button>
        </Link>
      </div>
      <Row>
        {loading &&
          <Loader></Loader>

        }
        {/* Render the other cards */}
        {vragenlijsten.map((vragenlijst, index) => (
          <Col xs={12} md={4} key={vragenlijst.survey_id} >
            <div className={styles.surveyBox}>
              <div className={styles.surveyContent}>
                <Link to={`/antwoorden/${vragenlijst.survey_id}`} style={{ textDecoration: 'none' }}>
                  <h2 className={styles.title}>{vragenlijst.name}</h2>
                </Link>

                <div className={styles.iconContainer}>
                  <Link to={`/vragen/${vragenlijst.survey_id}`} style={{ textDecoration: 'none' }}>
                    <i className={"fa-sharp fa-solid fa-pen-to-square " + styles.editIcon}></i>
                  </Link>
                  <i onClick={() => handleLinkClick(vragenlijst.survey_id)} className={" fa-sharp fa-solid fa-copy " + styles.shareIcon}></i>
                  <i onClick={() => deleteSurvey(vragenlijst.survey_id)} className={"fa-sharp fa-solid fa-trash " + styles.deleteIcon}></i>
                </div>
              </div>
              <SurveyInfoContainer id={vragenlijst.survey_id}></SurveyInfoContainer>
              <div className={styles.border}></div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EnqueteOverview;
