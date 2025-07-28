import { useState } from 'react';

export default function Home() {
  const [phone, setPhone] = useState('');
  const [cc, setCC] = useState('91');
  const [type, setType] = useState('sms');
  const [count, setCount] = useState(5);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const startBombing = async () => {
    setLoading(true);
    setLogs(['Starting...']);
    try {
      const res = await fetch('/api/bomb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode: cc, type, count })
      });
      const data = await res.json();
      setLogs(data.results.map(r => `${r.name || 'API'} — ${r.status}`));
    } catch (e) {
      setLogs(['Error starting bombing']);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6">SNX BOMBER</h1>
      <div className="grid gap-4 max-w-md">
        <input
          className="bg-gray-900 p-2 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <select
          className="bg-gray-900 p-2 rounded"
          value={cc}
          onChange={e => setCC(e.target.value)}
        >
          <option value="91">🇮🇳 +91</option>
          <option value="977">🇳🇵 +977</option>
          <option value="218">🇱🇾 +218</option>
        </select>
        <select
          className="bg-gray-900 p-2 rounded"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="sms">SMS</option>
          <option value="call">Call</option>
          <option value="mail">Mail</option>
          <option value="all">All</option>
        </select>
        <input
          className="bg-gray-900 p-2 rounded"
          placeholder="Number of Requests"
          type="number"
          value={count}
          onChange={e => setCount(e.target.value)}
        />
        <button
          className="bg-green-600 text-white p-2 rounded hover:bg-green-500"
          onClick={startBombing}
          disabled={loading}
        >
          {loading ? 'Running...' : 'Start Bombing'}
        </button>
        <div className="bg-gray-900 p-3 rounded h-64 overflow-y-auto text-sm">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </main>
  );
}