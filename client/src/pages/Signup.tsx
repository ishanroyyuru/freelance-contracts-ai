import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/signup", { name, email, password });
      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  const isValid = name.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-24 space-y-4">
      <h1 className="text-2xl font-bold">Sign up</h1>

      <label className="block">
        <span className="block text-sm font-medium">Name</span>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium">Email</span>
        <input
          id="email"
          type="email"
          placeholder="Email"
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
          placeholder="Password"
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
        Sign up
      </button>

      <p className="text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600">
          Log in
        </Link>
      </p>
    </form>
  );
}
