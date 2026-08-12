import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        Your tickets
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink">
        My Bookings
      </h1>
      {loading ? (
        <p className="mt-6 text-ink/50">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-paper-dim bg-white/50 py-14 text-center">
          <p className="font-display font-bold text-ink">No tickets yet</p>          <p className="mt-1 text-sm text-ink/50">
            Book an event to see it here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="relative rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5"
            >
              <p className="font-display font-bold text-ink">{b.eventTitle}</p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                Booked with {b.userEmail}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}