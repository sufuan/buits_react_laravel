export default function Index({ records }) {
  return (
    <div>
      <h2>Certificate Records</h2>
      <ul>
        {records.data.map(r => (
          <li key={r.id}>
            {r.certificate_number} - {r.user.name} (<a href={r.certificate_path}>View</a>)
          </li>
        ))}
      </ul>
    </div>
  );
}
