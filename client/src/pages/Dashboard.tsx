import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
const BACKEND_URL = "https://freelance-contracts-ai-production.up.railway.app";

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
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<{ id: string; title: string; snippet: string; }[]>([]);

    useEffect(() => {
        if(!token) return;

        axios.get<Contract[]>(`${BACKEND_URL}/contracts`, {
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
            const res = await axios.post(`${BACKEND_URL}/contracts`, 
                { title, text, status: "Draft" },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            setContracts([res.data, ...contracts]);
            setTitle("");
            setText("");
        } catch(err: any){
            alert(err.response?.data?.error || "Create contract failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this contract?")) return;
        try{
            await axios.delete(`${BACKEND_URL}/contracts/${id}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setContracts((cs) => cs.filter((c) => c.id !== id));
        }catch(err: any){
            console.error(err);
            alert("Delete failed");
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.get< typeof results >(`${BACKEND_URL}/search?query=${encodeURIComponent(searchTerm)}`,
                { headers: { Authorization: `Bearer ${token}`}}
            );
            setResults(res.data);
        }catch(err: any){
            console.error(err);
            alert("Search failed");
        }
    };

    return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Your Contracts</h1>
        <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto mb-8 flex space-x-2"
        >
        <input
            type="text"
            placeholder="Search contracts…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border p-2"
        />
        <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
        >
            Search
        </button>
        </form>

        {/* Search Results */}
        {results.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <ul className="space-y-4">
            {results.map((r) => (
                <li key={r.id} className="p-2 border rounded">
                <Link
                    to={`/contracts/${r.id}`}
                    className="text-blue-600 font-medium"
                >
                    {r.title}
                </Link>
                <p
                    className="mt-1 text-sm text-gray-700"
                    // snippet contains html/highlight tags—dangerouslySetInnerHTML
                    dangerouslySetInnerHTML={{ __html: r.snippet }}
                />
                </li>
            ))}
            </ul>
        </div>
        )}
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
