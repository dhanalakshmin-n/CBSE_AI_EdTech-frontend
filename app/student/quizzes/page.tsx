"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: number;
  classLevel: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
}

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetch("http://localhost:8080/api/student/quizzes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
        }
        return res.json();
      })
      .then((data) => {
        setQuizzes(data);
      })
      .catch((err) => {
        console.error("Error fetching quizzes:", err);
      });
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Quizzes</h2>

      {quizzes.length === 0 && <p>No quizzes available.</p>}

      {quizzes.map((quiz) => (
        <div
  key={quiz.id}
  onClick={() => router.push(`/student/quizzes/${quiz.id}`)}
  style={{
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  <h4>{quiz.questionText}</h4>
  <p>Class: {quiz.classLevel}</p>
</div>

      ))}
    </div>
  );
}
