import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;
  const eventId = `#EVT-${event.id.slice(0, 4).toUpperCase()}`;

  return (
    <Link
      to={`/event/${event.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image || "https://placehold.co/600x300/1b1b3a/f0a93c?text=Event"}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Perforation line with cut notches */}
      <div className="relative border-t-2 border-dashed border-paper-dim bg-white">
        <span className="ticket-notch ticket-notch-left" />
        <span className="ticket-notch ticket-notch-right" />
      </div>

      {/* Stub info */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-ink/60">
          {event.date} · {event.location}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-paper-dim pt-3">
          <span className="font-mono text-xs text-ink/40">{eventId}</span>
          <span
            className={`text-sm font-semibold ${
              soldOut ? "text-coral" : "text-mint"
            }`}
          >
            {soldOut ? "Sold out" : `${seatsLeft} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}