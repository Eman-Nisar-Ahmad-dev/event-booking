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

  if (!event)
    return (
      <div className="mx-auto max-w-2xl animate-pulse px-6 py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="h-64 w-full bg-paper-dim" />
          <div className="space-y-3 p-8">
            <div className="h-3 w-24 rounded bg-paper-dim" />
            <div className="h-6 w-2/3 rounded bg-paper-dim" />
            <div className="h-3 w-1/2 rounded bg-paper-dim" />
          </div>
        </div>
      </div>
    );

  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;
  const eventId = `#EVT-${event.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <img
          src={event.image || "https://placehold.co/800x400/1b1b3a/f0a93c?text=Event"}
          alt={event.title}
          className="h-64 w-full object-cover"
        />

        <div className="p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
            {eventId}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            {event.title}
          </h1>
          <p className="mt-2 text-ink/60">
            {event.date} at {event.time} · {event.location}
          </p>
          <p className="mt-4 leading-relaxed text-ink/80">{event.description}</p>
        </div>

        {/* Perforated ticket stub */}
        <div className="relative border-t-2 border-dashed border-paper-dim bg-white">
          <span className="ticket-notch ticket-notch-left" />
          <span className="ticket-notch ticket-notch-right" />
        </div>

        <div className="flex items-center justify-between bg-paper-dim/40 p-6">
          <div>
            <p className="font-mono text-xs text-ink/40">Availability</p>
            <p
              className={`font-display text-lg font-bold ${
                soldOut ? "text-coral" : "text-mint"
              }`}
            >
              {soldOut ? "Sold out" : `${seatsLeft} seats left`}
            </p>
          </div>
          <button
            onClick={handleBook}
            disabled={soldOut || booking}
            className="rounded-full bg-gold px-6 py-3 font-display font-bold text-marquee transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {booking ? "Booking..." : soldOut ? "Sold out" : "Book now"}
          </button>
        </div>
      </div>

      {status === "success" && (
        <p className="mt-4 text-center text-sm font-medium text-mint">
          Booked! Check "My Bookings" to see it.
        </p>
      )}
      {status && status !== "success" && (
        <p className="mt-4 text-center text-sm font-medium text-coral">
          {status}
        </p>
      )}
    </div>
  );
}