import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="flex items-center justify-between bg-marquee px-6 py-4 text-paper">
      <Link to="/" className="font-display text-xl font-bold tracking-tight">
        Event<span className="text-gold">Booking</span>
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="transition hover:text-gold">
          Events
        </Link>
        {currentUser ? (
          <>
            <Link to="/dashboard" className="transition hover:text-gold">
              My Bookings
            </Link>
            <Link to="/admin" className="transition hover:text-gold">
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-gold px-4 py-1.5 font-medium text-marquee transition hover:bg-gold-dark"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="transition hover:text-gold">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-gold px-4 py-1.5 font-medium text-marquee transition hover:bg-gold-dark"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}