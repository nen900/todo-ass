import React, { useState, useEffect } from 'react';
import "./App.css";
import Create from './Create';
import { BsCircleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import AuthUser from "./Auth";

function Home() {
    const [tasks, setTodo] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:8000/get", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
            .then(res => setTodo(res.data)) 
            .catch(err => console.error("Error fetching tasks:", err));
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);                   
        setTodo([]);                      
     };

    if (!token) {
        return (
            <AuthUser 
                onAuthSuccess={() => {
                    setToken(localStorage.getItem("token"));
                }} 
            />
        );
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/task/${id}`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })
    .then(() => {
        setTodo(prev => prev.filter(task => task._id !== id));
    })
    .catch(err => console.error("Error deleting task:", err));
    };

    return (
        <div>
            <h1 className='titleblock'>MY TODO LIST</h1>
            <button onClick={handleLogout}>Logout</button>

            <Create setTodo={setTodo} />
            {tasks.length === 0 ? (
                <div className='home'>
                    <h2>Oops, no task yet. (add a task)</h2>
                </div>
            ) : (
                tasks.map((todo, index) => (
                    <div className='task' key={todo._id || index}>
                        <div className='checkbox'>
                            <BsCircleFill className="icon" />
                            <p>{todo.task}</p>
                        </div>
                        
                        <FaTrash className="delete" onClick={() => handleDelete(todo._id)} />

                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
