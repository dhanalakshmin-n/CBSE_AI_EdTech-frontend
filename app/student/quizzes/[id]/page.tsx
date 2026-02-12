"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 2 mins

  // Fetch Quiz
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/student/quizzes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, [id]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  if (!quiz) return <p className="p-10">Loading...</p>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const options = [
    quiz.option1,
    quiz.option2,
    quiz.option3,
    quiz.option4,
  ];

  return (
    <div className="bg-[#F6F8FC] min-h-screen px-10 py-8">

      {/* Top Card */}
      <div className="bg-white rounded-2xl shadow-sm px-8 py-6 flex justify-between items-center mb-8">

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-black"
          >
            ←
          </button>

          <div>
            <h2 className="text-xl font-semibold">
              Practice Quiz
            </h2>
            <p className="text-gray-500 text-sm">
              Question 1 of 1
            </p>
          </div>
        </div>

        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-medium">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm px-10 py-10">

        <span className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full font-medium">
          Question 1
        </span>

        <h1 className="text-2xl font-semibold mt-6 mb-8 leading-relaxed">
          {quiz.questionText}
        </h1>

        {/* Options */}
        <div className="space-y-5">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;

            return (
              <div
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
              >
                <div className="flex items-center gap-5">

                  {/* Letter Circle */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <p className="text-lg">{option}</p>
                </div>

                {isSelected && (
                  <div className="text-blue-600 text-xl">✔</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress + Button */}
        <div className="mt-12 flex items-center justify-between">

          <div className="w-1/3 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
          </div>

          <button
            onClick={submitAnswer}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Submit Quiz
          </button>
        </div>

        {result && (
          <div className="mt-6 text-lg font-semibold">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
