export default function Design({ template }) {
  return (
    <div>
      <h2>Design Canvas for: {template.name}</h2>
      <div className="canvas">/* Drag-&-Drop here! */</div>
    </div>
  );
}
