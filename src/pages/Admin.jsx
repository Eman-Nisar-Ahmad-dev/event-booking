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

const inputClass =
  "w-full rounded-lg border border-paper-dim bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Backstage
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">
        Manage Events
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="font-display font-bold text-ink">Add new event</h2>
        {error && (
          <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event title"
          className={inputClass}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className={inputClass}
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="totalSeats"
            value={form.totalSeats}
            onChange={handleChange}
            min={1}
            placeholder="Total seats"
            className={inputClass}
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            placeholder="Price (0 = free)"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-marquee px-6 py-2.5 font-display font-bold text-paper transition hover:bg-marquee-light disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add event"}
        </button>
      </form>

      <h2 className="mt-10 font-display font-bold text-ink">
        Existing events
      </h2>
      <ul className="mt-3 space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5"
          >
            <div>
              <p className="font-display font-bold text-ink">{ev.title}</p>
              <p className="mt-0.5 font-mono text-xs text-ink/40">
                {ev.date} · {ev.seatsBooked}/{ev.totalSeats} booked
              </p>
            </div>
            <button
              onClick={() => handleDelete(ev.id)}
              className="rounded-full bg-coral/10 px-4 py-1.5 text-sm font-medium text-coral transition hover:bg-coral/20"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}