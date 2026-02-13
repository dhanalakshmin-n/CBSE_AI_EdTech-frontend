"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: number;
  questionText: string;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/student/quizzes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    const text = await res.text();

    return text ? JSON.parse(text) : [];
  })
  .then((data) => setQuizzes(data))
  .catch((err) => {
    console.error(err);
    setQuizzes([]);
  });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Available Quizzes</h1>
      <p className="text-gray-500 mb-8">
        Practice sets curated specifically for your class.
      </p>

      <div className="grid grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => router.push(`/student/quizzes/${quiz.id}`)}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                🎓
              </div>
              <span className="text-sm text-gray-400">15 Mins</span>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {quiz.questionText}
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Practice Question
            </p>

            <div className="text-green-600 font-medium">
              Ready to Attempt →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
