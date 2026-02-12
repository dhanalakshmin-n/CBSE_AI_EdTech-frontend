"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Quiz {
  id: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export default function AttemptQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/api/student/quizzes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch quiz");
      return res.json();
    })
    .then((data) => setQuiz(data))
    .catch((err) => console.error(err));
}, [id]);

  const submitAnswer = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/student/quizzes/${id}/attempt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: Number(id),
          selectedAnswer,
        }),
      }
    );

    const data = await res.json();

    setResult(data.correct ? "Correct ✅" : "Wrong ❌");
  };

  if (!quiz) return <p>Loading...</p>;

  
return (
  <div style={{ padding: 20 }}>
    <h2>{quiz.questionText}</h2>

    {[quiz.option1, quiz.option2, quiz.option3, quiz.option4].map(
      (option, index) => (
        <label key={index} style={{ display: "block", marginBottom: 10 }}>
          <input
            type="radio"
            name="option"
            value={option}
            checked={selectedAnswer === option}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            style={{ marginRight: 8 }}
          />
          {option}
        </label>
      )
    )}

    <br />
    <button onClick={submitAnswer}>Submit</button>

    {result && <h3>{result}</h3>}
  </div>
);

}
