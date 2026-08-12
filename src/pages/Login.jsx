import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto mt-16 max-w-sm px-6">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h2 className="font-display text-2xl font-bold text-ink">Log in</h2>
        {error && (
          <p className="mt-3 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-paper-dim px-3 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-paper-dim px-3 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-marquee py-2.5 font-display font-bold text-paper transition hover:bg-marquee-light disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-ink/50">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-gold-dark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}