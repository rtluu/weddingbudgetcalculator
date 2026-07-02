// Renders a JSON-LD structured-data <script>. Server component — the JSON is
// serialized at build/request time, never on the client.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user input); this is the standard
      // way to embed JSON-LD in React.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
