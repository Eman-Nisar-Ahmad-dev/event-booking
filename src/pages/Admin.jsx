import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image: "",
  totalSeats: 20,
  price: 0,
};

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalSeats" || name === "price" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.date || !form.location) {
      setError("Title, date, and location are required.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "events"), {
        ...form,
        seatsBooked: 0,
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
    } catch (err) {
      setError("Could not save event. Please try again.");
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await deleteDoc(doc(db, "events", id));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Manage Events</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-lg border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800">Add new event</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event title"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="totalSeats"
            value={form.totalSeats}
            onChange={handleChange}
            min={1}
            placeholder="Total seats"
            className="rounded border border-slate-300 px-3 py-2"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            placeholder="Price (0 = free)"
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-emerald-500 px-5 py-2 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add event"}
        </button>
      </form>

      <h2 className="mt-10 font-semibold text-slate-800">Existing events</h2>
      <ul className="mt-3 space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="flex items-center justify-between rounded border border-slate-200 p-3"
          >
            <div>
              <p className="font-medium text-slate-900">{ev.title}</p>
              <p className="text-sm text-slate-500">
                {ev.date} · {ev.seatsBooked}/{ev.totalSeats} booked
              </p>
            </div>
            <button
              onClick={() => handleDelete(ev.id)}
              className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}