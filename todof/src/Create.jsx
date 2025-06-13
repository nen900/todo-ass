import React, { useState } from "react";
import axios from "axios";

function Create({ setTodo }) {
    const [input, setInput] = useState("");

    const handleAdd = () => {
        if (!input.trim()) return;

        const token = localStorage.getItem("token");

        axios.post(
            "http://localhost:8000/task",
            { input }, 

            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        .then(result => {
            const newTask = result.data.task;
            setTodo(prev => [...prev, newTask]);
            setInput(""); 
        })
        .catch(err => {
            console.error("Error adding task:", err.response?.data || err.message);
        });
    };

    return (
        <div className="create_task">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Set up tasks 7:40am 💗"
            />
            <button type="button" onClick={handleAdd}>Enter task</button>
        </div>
    );
}

export default Create;
