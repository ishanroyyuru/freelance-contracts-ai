import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setToken } = useAuth();
    const navigate = useNavigate();
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5001/login", { email, password });
            setToken(res.data.token);
            navigate("/", { replace: true});
        } catch(err: any){
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
            <h1 className="text-2xl font-bold">Log in</h1>
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border p-2"
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border p-2"
            />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Log in
            </button>
            
            <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600">
                    Sign up
                </Link>
            </p>
        </form>
    );
};
