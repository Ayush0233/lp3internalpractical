'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [form, setForm] = useState({
    roll: '',
    name: '',
    course: '',
    gender: 'male',
    email: '',
  });
  const [resp, setResp] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    try {
      const r = await fetch('/api/student');
      const j = await r.json();
      setList(j.students || []);
    } catch (e) {
      console.error('fetch error', e);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResp(null);
    try {
      const r = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      setResp({ status: r.status, body: j });
      await fetchStudents();
    } catch (err) {
      setResp({ status: 'network_error', body: String(err) });
    } finally {
      setLoading(false);
    }
  }

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  return (
    <main className="min-h-screen bg-green-50 text-gray-800 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-semibold text-green-700 text-center mb-6">🎓 Student Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Roll Number</label>
            <input
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={form.roll}
              onChange={e => update('roll', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Course</label>
            <input
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={form.course}
              onChange={e => update('course', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <select
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={form.gender}
              onChange={e => update('gender', e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-green-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Response Section */}
      <div className="w-full max-w-xl bg-white mt-8 p-6 rounded-2xl shadow border border-green-200">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Response from API</h2>
        <pre className="bg-green-50 p-3 rounded-lg text-sm text-gray-700 overflow-x-auto">
          {resp ? JSON.stringify(resp, null, 2) : 'No response yet.'}
        </pre>
      </div>

      {/* Student List */}
      <div className="w-full max-w-xl bg-white mt-8 p-6 rounded-2xl shadow border border-green-200">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Submitted Students</h2>
        <p className="text-sm mb-2">Total: {list.length}</p>
        <ul className="divide-y divide-green-100">
          {list.map(s => (
            <li key={s.id} className="py-2">
              <strong className="text-green-700">{s.roll}</strong> — {s.name} ({s.course}) — {s.gender} — {s.email}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
