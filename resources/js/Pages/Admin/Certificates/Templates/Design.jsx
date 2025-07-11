import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { useState } from 'react';
import { Rnd } from 'react-rnd';

const defaultElements = [
  { id: 'name', text: '{name}', x: 100, y: 100 },
  { id: 'father_name', text: '{father_name}', x: 100, y: 150 },
  { id: 'qrCode', text: '{qrCode}', x: 500, y: 100 },
];

export default function CertificateDesigner() {
  const [elements, setElements] = useState(defaultElements);

  const handleDragStop = (id, d) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: d.x, y: d.y } : el))
    );
  };

  return (
    <AdminAuthenticatedLayout>
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/certificate-background.png"
        alt="Certificate Background"
        className="absolute top-0 left-0 w-full h-full object-contain z-0"
      />

      <div className="absolute top-0 left-0 w-full h-full z-10">
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: 'auto', height: 'auto' }}
            position={{ x: el.x, y: el.y }}
            onDragStop={(e, d) => handleDragStop(el.id, d)}
            bounds="parent"
            enableResizing={false}
          >
            <div className="px-2 py-1 text-black font-semibold border border-gray-400 bg-white rounded shadow cursor-move">
              {el.text}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
    </AdminAuthenticatedLayout>
  );
}
