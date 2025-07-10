import { router } from '@inertiajs/react';

export default function Index({ templates }) {
  return (
    <div>
      <h1>Templates</h1>
      {templates.map(t => (
        <div key={t.id}>
          {t.name} ({t.type.name})
          <a href={route('admin.certificate.templates.edit', t.id)}>Edit</a>
          <a href={route('admin.certificate.template_design', t.id)}>Design</a>
        </div>
      ))}
      <a href={route('admin.certificate.template-create')}>+ New Template</a>
    </div>
  );
}
