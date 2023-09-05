import { useEffect } from "react";
import styles from "./Loader.module.css";
const AnswerChart = () => {

    return (
        <div className={styles.container}>
            <div className={styles.soundWave}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )

}



export default AnswerChart