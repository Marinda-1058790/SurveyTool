import { useEffect } from "react";
import Chart from 'chart.js/auto';


const AnswerChart = (data) => {
    useEffect(() => {
            let item=data.question
            let labelList = []
            let scoreList = []
            for (let key of item.choices) {
                labelList.push(key.number.toUpperCase())
                // console.log(key)
                let score = 0
                for (let answer of item.answers) {
                    if(answer.answer.toUpperCase() == key.number.toUpperCase()){
                        score++
                    }
                }
                scoreList.push(score)
            }
            const ctx = document.getElementById('myChart'+item.question_id);
            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labelList,
                    datasets: [{
                        label: 'Aantal gekozen',
                        data: scoreList,
                        backgroundColor: data.colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });


    }, [])

    return (
        <canvas id={"myChart"+data.question.question_id}></canvas>
    )

}



export default AnswerChart