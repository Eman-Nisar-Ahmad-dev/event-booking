import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-marquee px-6 py-20 text-center text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f0a93c 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
            Your ticket starts here
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Find your next event.{" "}
            <span className="text-gold">Book the seat.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-paper/70">
            Browse what's happening nearby and reserve your spot in seconds.
          </p>
        </div>
      </section>

      {/* Event grid */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
              >
                <div className="h-44 bg-paper-dim" />
                <div className="border-t-2 border-dashed border-paper-dim" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-paper-dim" />
                  <div className="h-3 w-1/2 rounded bg-paper-dim" />
                  <div className="mt-4 flex justify-between border-t border-dashed border-paper-dim pt-3">
                    <div className="h-3 w-16 rounded bg-paper-dim" />
                    <div className="h-3 w-12 rounded bg-paper-dim" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-paper-dim bg-white/50 py-16 text-center">
            <p className="font-display text-lg font-bold text-ink">
              No events on the board yet
            </p>
            <p className="mt-1 text-sm text-ink/50">
              Add one from the Admin page to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}