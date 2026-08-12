import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import EventCard from "../components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot keeps the list live — any change in Firestore updates the UI instantly
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <section className="bg-slate-900 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Find & book events near you</h1>
        <p className="mt-3 text-slate-300">
          Browse upcoming events and reserve your seat in seconds.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-slate-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-slate-500">
            No events yet. Add some in your Firestore "events" collection.
          </p>
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