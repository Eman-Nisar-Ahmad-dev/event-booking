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
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
      <Link to="/" className="text-xl font-bold tracking-tight">
        EventBooking
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="hover:text-emerald-400">
          Events
        </Link>
        {currentUser ? (
          <>
            <Link to="/dashboard" className="hover:text-emerald-400">
              My Bookings
            </Link>
            <Link to="/admin" className="hover:text-emerald-400">
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-emerald-500 px-3 py-1.5 font-medium hover:bg-emerald-600"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-emerald-400">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded bg-emerald-500 px-3 py-1.5 font-medium hover:bg-emerald-600"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}