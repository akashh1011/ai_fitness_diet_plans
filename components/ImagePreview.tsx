// components/ImagePreview.tsx

interface Props {
  label: string | null;
  imageUrl: string | null;
}

export default function ImagePreview({ label, imageUrl }: Props) {
  if (!label) return null;

  return (
    <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <h2 className="font-semibold mb-2">AI Visual for: {label}</h2>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={label}
          className="rounded-xl max-h-72 w-full object-cover"
        />
      ) : (
        <p className="text-sm text-slate-400">Generating image...</p>
      )}
    </section>
  );
}
