import React, { useState } from "react";
import { submitWorkflow } from "../services/api";

const StudentWorkflow = ({ questionId }) => {
  const [tasks, setTasks] = useState([{ name: "", statements: [""] }]);

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index].name = value;
    setTasks(newTasks);
  };

  const handleStatementChange = (taskIndex, statementIndex, value) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].statements[statementIndex] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    await submitWorkflow({ question_id: questionId, tasks });
  };

  return (
    <div>
      <h2>Answer Question</h2>
      {tasks.map((task, index) => (
        <div key={index}>
          <input value={task.name} onChange={(e) => handleTaskChange(index, e.target.value)} placeholder="Task Name" />
          <textarea value={task.statements[0]} onChange={(e) => handleStatementChange(index, 0, e.target.value)} placeholder="Enter statements"></textarea>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default StudentWorkflow;
