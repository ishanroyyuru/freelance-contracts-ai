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

type Summary = {
    id: string;
    originalText: string;
    summaryText: string;
    createdAt: string;
}

export default function Contract() {
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [contract, setContract] = useState<ContractDetail | null>(null);
    const [startOffset, setStartOffset] = useState(0);
    const [endOffset, setEndOffset] = useState(0);
    const [comment, setComment] = useState("");
    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [originalText, setOriginalText] = useState("");
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

        axios
        .get<Summary[]>(`http://localhost:5001/contracts/${id}/summaries`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setSummaries(res.data))
        .catch(err => {
            console.error("Failed to load summaries:", err);
        });
    }, [id, token]);

    const handleAnnotate = async(e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post(`http://localhost:5001/contracts/${id}/annotations`, 
                { startOffset, endOffset, comment },
                { headers: { Authorization: `Bearer ${token}`} },
            );
            setAnnotations((prev) => [res.data, ...prev]);
            setStartOffset(0);
            setEndOffset(0);
            setComment("");
        } catch(err: any){
            console.error(err);
            alert("Failed to add annotation");
        }
    };

    const handleSummarize = async(e: React.FormEvent) => {
        if(!originalText) return;
        try{
            const res = await axios.post<Summary>(`http://localhost:5001/contracts/${id}/summaries`,
                { originalText },
                { headers: {Authorization: `Bearer ${token}` } }
            );
            setSummaries((prev) => [res.data, ...prev]);
            setOriginalText("");
        } catch(err){
            console.error(err);
            alert("Failed to summarize");
        }
    }
    
    if (!contract) return <p>Loading contract…</p>;
    return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold">{contract.title}</h1>
        <p className="mt-2 whitespace-pre-wrap">{contract.text}</p>
        <div className="mt-2 text-sm text-gray-500">Status: {contract.status}</div>

        <h2 className="text-xl font-semibold mt-8">Annotations</h2>
        <form onSubmit={handleAnnotate} className="space-y-2 my-4 p-4 border rounded">
        <h3 className="font-medium">New Annotation</h3>
        <div className="flex space-x-2">
            <input
            type="number"
            value={startOffset}
            onChange={e => setStartOffset(+e.target.value)}
            placeholder="Start"
            className="w-1/4 border p-1"
            required
            />
            <input
            type="number"
            value={endOffset}
            onChange={e => setEndOffset(+e.target.value)}
            placeholder="End"
            className="w-1/4 border p-1"
            required
            />
        </div>
        <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comment"
            className="w-full border p-2"
            required
        />
        <button type="submit" className="bg-purple-600 text-white py-1 px-3 rounded">
            Add Annotation
        </button>
        </form>
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
        <div className="my-6 p-4 border rounded">
        <h3 className="font-medium">Generate Summary</h3>
        <textarea
            value={originalText}
            onChange={e => setOriginalText(e.target.value)}
            placeholder="Paste clause or selection…"
            className="w-full border p-2 h-24"
        />
        <button
            onClick={handleSummarize}
            className="bg-indigo-600 text-white py-1 px-3 rounded mt-2"
        >
            Summarize with AI
        </button>
        </div>

        <h2 className="text-xl font-semibold">Summaries</h2>
        <ul className="space-y-2">
        {summaries.map(s => (
            <li key={s.id} className="p-2 border rounded">
            <p className="italic text-sm text-gray-600">{s.originalText}</p>
            <p>{s.summaryText}</p>
            <div className="text-xs text-gray-500 mt-1">
                {new Date(s.createdAt).toLocaleString()}
            </div>
            </li>
        ))}
        </ul>
    </div>
  );
}
