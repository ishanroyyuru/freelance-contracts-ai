import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
const BACKEND_URL = "https://freelance-contracts-ai-production.up.railway.app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/login`, { email, password });
      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  // disable until both fields have text
  const isValid = email.trim() !== "" && password.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
      <h1 className="text-2xl font-bold">Log in</h1>

      <label className="block">
        <span className="block text-sm font-medium">Email</span>
        <input
          id="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium">Password</span>
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />
      </label>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        Log in
      </button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600">
          Sign up
        </Link>
      </p>
    </form>
  );
}
