import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";

type ContractDetail = {
  id: string;
  title: string;
  text: string;
  status: string;
  createdAt: string;
};

type Annotation = {
  id: string;
  startOffset: number;
  endOffset: number;
  comment: string;
  createdAt: string;
};

export default function Contract() {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [contract, setContract] = useState<ContractDetail | null>(null);
    const [startOffset, setStartOffset] = useState(0);
    const [endOffset, setEndOffset] = useState(0);
    const [comment, setComment] = useState("");
    const { id } = useParams< { id: string } >();
    const { token } = useAuth();

    useEffect(() => {
        if (!id || !token) return;

        axios
        .get<ContractDetail>(`http://localhost:5001/contracts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setContract(res.data))
        .catch((err) => {
            console.error("Failed to load contract:", err);
            alert("Could not load contract details");
        });

        axios
        .get<Annotation[]>(`http://localhost:5001/contracts/${id}/annotations`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAnnotations(res.data))
        .catch((err) => {
            console.error("Failed to load annotations:", err);
            alert("Could not load annotations");
        });
    }, [id, token]);
    
    if (!contract) return <p>Loading contract…</p>;
    return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold">{contract.title}</h1>
        <p className="mt-2 whitespace-pre-wrap">{contract.text}</p>
        <div className="mt-2 text-sm text-gray-500">Status: {contract.status}</div>

        <h2 className="text-xl font-semibold mt-8">Annotations</h2>
        <ul className="space-y-2">
        {annotations.map(a => (
            <li key={a.id} className="p-2 border rounded">
            <div className="text-sm text-gray-500">
                [{a.startOffset}, {a.endOffset}] – {new Date(a.createdAt).toLocaleString()}
            </div>
            <p>{a.comment}</p>
            </li>
        ))}
        </ul>
    </div>
  );
}
