import { useNavigate } from 'react-router-dom';
import './notFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <h1>404</h1>
        <p>Page not found.</p>
        <div className="not-found-actions">
          <button type="button" onClick={() => navigate('/')}>Go Home</button>
          <button type="button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
