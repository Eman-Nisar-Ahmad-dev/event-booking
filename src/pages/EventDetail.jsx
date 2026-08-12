import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [booking, setBooking] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "events", id), (snap) => {
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
    });
    return unsubscribe;
  }, [id]);

  async function handleBook() {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setBooking(true);
    setStatus("");

    try {
      // Transaction ensures seat count updates safely even with concurrent bookings
      await runTransaction(db, async (transaction) => {
        const eventRef = doc(db, "events", id);
        const eventDoc = await transaction.get(eventRef);

        if (!eventDoc.exists()) throw new Error("Event no longer exists.");

        const data = eventDoc.data();
        if (data.seatsBooked >= data.totalSeats) {
          throw new Error("This event is sold out.");
        }

        transaction.update(eventRef, { seatsBooked: data.seatsBooked + 1 });
      });

      await addDoc(collection(db, "bookings"), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        eventId: id,
        eventTitle: event.title,
        bookedAt: serverTimestamp(),
      });

      setStatus("success");
    } catch (err) {
      setStatus(err.message || "Something went wrong. Please try again.");
    }
    setBooking(false);
  }

  if (!event) return <p className="p-6 text-slate-500">Loading event...</p>;

  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <img
        src={event.image || "https://placehold.co/800x400?text=Event"}
        alt={event.title}
        className="w-full rounded-lg object-cover"
      />
      <h1 className="mt-6 text-3xl font-bold text-slate-900">{event.title}</h1>
      <p className="mt-2 text-slate-500">
        {event.date} at {event.time} · {event.location}
      </p>
      <p className="mt-4 text-slate-700">{event.description}</p>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 p-4">
        <span className={soldOut ? "text-red-500" : "text-emerald-600"}>
          {soldOut ? "Sold out" : `${seatsLeft} seats left`}
        </span>
        <button
          onClick={handleBook}
          disabled={soldOut || booking}
          className="rounded bg-emerald-500 px-5 py-2 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {booking ? "Booking..." : soldOut ? "Sold out" : "Book now"}
        </button>
      </div>

      {status === "success" && (
        <p className="mt-4 text-sm text-emerald-600">
          Booked! Check "My Bookings" to see it.
        </p>
      )}
      {status && status !== "success" && (
        <p className="mt-4 text-sm text-red-500">{status}</p>
      )}
    </div>
  );
}