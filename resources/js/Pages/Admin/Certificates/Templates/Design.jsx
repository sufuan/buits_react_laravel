import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Design({ template }) {
  const [design, setDesign] = useState(template?.design?.design_content || '');

  const handleSave = () => {
    router.post(route('admin.certificate.templates.updateDesign'), {
      template_id: template.id,
      design_content: design,
    }, {
      preserveScroll: true,
    });
  };

  return (
    <div>
      <h1>Design Template: {template.name}</h1>

      <textarea
        rows={20}
        className="w-full border p-2"
        value={design}
        onChange={(e) => setDesign(e.target.value)}
      />

      <button onClick={handleSave}>Save Design</button>
    </div>
  );
}
