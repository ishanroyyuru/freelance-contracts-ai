import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

type Contract = {
    id: string;
    title: string;
    createdAt: string;
};

export default function Dashboard() {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [contracts, setContracts] = useState<Contract[]>([]);

    useEffect(() => {
        if(!token) return;

        axios.get<Contract[]>("http://localhost:5001/contracts", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setContracts(res.data))
        .catch((err) => {
            console.error(err);
            alert("Failed to load your contracts");
        });
    }, [token]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:5001/contracts", 
                { title, text, status: "Draft" },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            setContracts([res.data, ...contracts]);
            setTitle("");
            setText("");
        } catch(err: any){
            alert(err.response?.data?.error || "Create contract failed");
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this contract?")) return;
        try{
            await axios.delete(`http://localhost:5001/contracts/${id}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setContracts((cs) => cs.filter((c) => c.id !== id));
        }catch(err: any){
            console.error(err);
            alert("Delete failed");
        }
    }

    return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Your Contracts</h1>
        <form onSubmit={handleCreate} className="max-w-3xl mx-auto mb-8 space-y-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">New Contract</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border p-2"
                required
            />

            <textarea
                placeholder="Full contract text…"
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full border p-2 h-32"
                required
            />

            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
                Create Contract
            </button>
        </form>
      {contracts.length === 0 ? (
        <p>No contracts yet.</p>
      ) : (
        <ul className="space-y-4">
          {contracts.map((c) => (
            <li key={c.id} className="p-4 border rounded hover:shadow">
              <Link to={`/contracts/${c.id}`} className="text-blue-600 font-medium">
                {c.title}
              </Link>
              <div className="text-sm text-gray-500">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
