

import React, { useState } from "react";
import "./Auth.css"; 

function AuthUser({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            return setError("Both fields are required.");
        }

        try {
            const endpoint = isLogin ? "/login" : "/signup";
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Auth failed");

            localStorage.setItem("token", data.token);
            onAuthSuccess(); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="details-bg">
            <div className="details">
                <h2>{isLogin ? "Welcome back to MyTodo, <br/>Log In" : "Welcome to MyTodo, <br/>Sign Up"}</h2>

                <input
                    type="text"
                    placeholder="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                {error && <p className="error">{error}</p>}

                <button onClick={handleSubmit}>
                    {isLogin ? "Log In" : "Sign Up"}
                </button>

                <p onClick={() => setIsLogin(!isLogin)} className="toggle">
                    {isLogin ? "Are you new, please sign up" : "or have an account? please log In"}
                </p>

            </div>
        </div>
    );
}

export default AuthUser;
