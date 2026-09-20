import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-32 px-6 max-w-[1200px] mx-auto text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <p className="text-xl mb-8">Page not found.</p>
      <Link to="/" className="text-[var(--blue)] font-medium underline">
        Return to Home
      </Link>
    </div>
  );
}
