import React, { useState, useEffect } from "react";
import { postQuestion, getQuestions } from "../services/api";

const InstructorPanel = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async () => {
    await postQuestion({ title, description });
    setTitle("");
    setDescription("");
    fetchQuestions();
  };

  return (
    <div>
      <h2>Instructor Panel - Post Questions</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <button onClick={handleSubmit}>Post</button>

      <h3>Posted Questions:</h3>
      <ul>
        {questions.map((q) => (
          <li key={q.id}><strong>{q.title}:</strong> {q.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorPanel;
