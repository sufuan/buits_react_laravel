export default function Generate({ templates }) {
  return (
    <div>
      <h2>Generate Certificate</h2>
      {templates.map(t => <button key={t.id}>{t.name}</button>)}
    </div>
  );
}
