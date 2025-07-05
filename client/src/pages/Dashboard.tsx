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
    }, [token])

    return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Your Contracts</h1>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
