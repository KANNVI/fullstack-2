import NavBar from '../components/NavBar';

const MOCK_USERS = [
  { name: 'Aditi Sharma', role: 'Admin' },
  { name: 'Rohan Mehta', role: 'Editor' },
  { name: 'Kannvi Rani', role: 'Viewer' }
];

export default function AdminPanel() {
  return (
    <div className="page">
      <NavBar />
      <main className="page-content">
        <h1>Admin panel</h1>
        <p className="muted">Only users with the Admin role can reach this route.</p>
        <section className="panel">
          <h2>User management</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.name}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>
                    <button disabled>Edit permissions</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
