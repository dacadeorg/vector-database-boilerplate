export default function Textarea({ content, setContent }) {
  return (
    <section className="pane editor">
      Provide Text for Vectorization:
      <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)}  rows={30} cols={56} required />
    </section>
  );
}
