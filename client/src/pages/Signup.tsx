import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5001/signup", { email, password, name });
            setToken(res.data.token);
            navigate("/", { replace: true });
        } catch(err: any){
            alert(err.response?.data?.error || "Signup failed");
        }
    };
    return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
        <h1 className="text-2xl font-bold">Sign up</h1>

        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2"
        />

        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2"
        />

        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Sign up
        </button>

        <p className="text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
            Log in
        </Link>
        </p>
    </form>
    );
    };
