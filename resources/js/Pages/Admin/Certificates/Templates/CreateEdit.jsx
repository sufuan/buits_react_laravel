import { useForm } from '@inertiajs/react';

export default function CreateEdit({ template = null, types }) {
  const { data, setData, post } = useForm({
    id: template?.id || '',
    name: template?.name || '',
    certificate_type_id: template?.certificate_type_id || '',
    layout: template?.layout || '',
    content: template?.content || ''
  });

  return (
    <form onSubmit={e => { e.preventDefault(); post(route('admin.certificate.template-store')) }}>
      <input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Name"/>
      <select value={data.certificate_type_id} onChange={e => setData('certificate_type_id', e.target.value)}>
        {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <textarea value={data.content} onChange={e => setData('content', e.target.value)} placeholder="Content"/>
      <button type="submit">Save</button>
    </form>
  );
}
