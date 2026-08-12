import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;

  return (
    <Link
      to={`/event/${event.id}`}
      className="block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={event.image || "https://placehold.co/600x300?text=Event"}
        alt={event.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {event.date} · {event.location}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              soldOut ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {soldOut ? "Sold out" : `${seatsLeft} seats left`}
          </span>
          {event.price ? (
            <span className="text-sm font-semibold">${event.price}</span>
          ) : (
            <span className="text-sm font-semibold">Free</span>
          )}
        </div>
      </div>
    </Link>
  );
}