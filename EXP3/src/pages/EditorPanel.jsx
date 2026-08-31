import NavBar from '../components/NavBar';

export default function EditorPanel() {
  return (
    <div className="page">
      <NavBar />
      <main className="page-content">
        <h1>Content tools</h1>
        <p className="muted">Reachable by Admin and Editor roles.</p>
        <section className="panel">
          <h2>Draft a page</h2>
          <textarea rows={6} placeholder="Write something…" />
          <button style={{ marginTop: '0.75rem' }}>Save draft</button>
        </section>
      </main>
    </div>
  );
}
