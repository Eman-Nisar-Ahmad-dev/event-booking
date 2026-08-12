import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>

      {loading ? (
        <p className="mt-4 text-slate-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-4 text-slate-500">
          You haven't booked any events yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <p className="font-medium text-slate-900">{b.eventTitle}</p>
              <p className="text-sm text-slate-500">
                Booked with {b.userEmail}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}