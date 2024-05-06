import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/authProvider.jsx";
import axios from "axios";
import QuizLeaderboard from "../components/Quiz/QuizLeaderboard.jsx";
import "../styles/Results.css"

function QuizResults() {
  const { userId } = useAuth();
  const { state: { answerArray, selectedArray, quizLength, quizFullJson } } = useLocation();
  const { _id: quizId, quizName, questions } = quizFullJson;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    console.log("Answer Array => ", answerArray);
    console.log("Selected Array => ", selectedArray);
    console.log("Quiz Length => ", quizLength);
    console.log("Quiz => ", quizFullJson);

    const correctAnswerCount = answerArray.reduce((acc, answer, index) => {
      if (answer === selectedArray[index]) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const percentCorrect = ((correctAnswerCount / quizLength) * 100).toFixed(2);
    setPercentage(percentCorrect);
  }, [answerArray, selectedArray, quizLength, quizFullJson]);

  const publishScore = async () => {
    const jsonBody = {
      user: userId,
      score: percentage,
    };

    console.log("Sending ----> ", jsonBody);

    try {
      const res = await axios.post(
        `http://localhost:4000/api/quizzes/publishScore/${quizId}`,
        jsonBody
      );
      console.log(res);
    } catch (err) {
      console.log("Error posting score: ", err);
    }
  };

  const publishComment = async () => {
    let userComment = document.getElementById("comment").value;

    const comment = {
      userID: userId,
      quizID: quizId,
      comment: userComment,
    };

    try {
      const res = await axios.post(
        `http://localhost:4000/api/comments`,
        comment
      );
      console.log(res);
    } catch (err) {
      console.log("Error publishing comment: ", err);
    }
  };

  const getComments = async () => {
    let id;
    try {
      const res = await axios.get(
        `http://localhost:4000/api/comments/quiz`,
        quizId
      );
      id = res.data.userID;
      console.log(res);
    } catch (err) {
        console.log("Error:", err);
    }
   try {
      const res = await axios.get(
        `http://localhost:4000/api/user${id}`
      )
console.log(res);
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <div className="results-page content set-container">
      <div className="results-page-container">
        <div className="results-page-head-can">
          <p className="quiz-title">{quizName}</p>
          <p className="results-score">Score: {percentage}% </p>
        </div>
        <hr />

        <div className="results-questions">
          {questions.map((item, index) => (
            <div key={index} className="quiz-each-question">
              <p className="quiz-question">
                <span className="font-bold">Question:</span>
                {item.question}
              </p>

              <p className="results-correct-answer"> 
                <span 
                className="results-correct-answer font-bold mr-1 text-green-500"
                >
                  Correct Answer:
                </span> 
              {item.answer}
              </p>

              <p className="results-correct-answer"> 
              <span 
              className={`font-bold mr-1 ${item.answer === selectedArray[index] 
              ? "results-correct" : "results-incorrect"}`}
              >
                You Answered:
              </span> 
              {selectedArray[index]}
            </p>
            </div>
          ))}

          <div className="flex justify-center">
            <button 
            onClick={publishScore}
            className="results-post-button"
            >
              Post Score
            </button>
          </div>
        </div>

        <hr/>

        <div className="results-leaderboard">
          <p className="results-lb-head quiz-title">Leaderboard:</p>
          <QuizLeaderboard quizId={quizId} />
        </div>

        <hr/>

        <div className="results-comments">
          <div className="results-comments-head">
            <p>Leave a comment:</p>
            <textarea id="comment"></textarea>
            <button onClick={() => publishComment()}>Join the Conversation</button>
      </div>

          <div className="results-comments-shown">
            <p>Comments:</p>
            <button onClick={() => getComments()}>Test</button>
            <p id="Comment"></p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default QuizResults;
