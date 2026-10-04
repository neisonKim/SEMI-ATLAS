import manifest from '@/lib/image-manifest.json';
import { imageLabels } from '@/lib/image-labels.mjs';

const imageMeta = Object.fromEntries(
  manifest.map((item) => [item.file.replace(/\.(webp|svg)$/i, ''), item])
);

export default function AssetImage({ name, alt = '', className = '', eager = false }) {
  const meta = imageMeta[name] || {
    file: `${name}.webp`,
    width: 1536,
    height: 1024,
    kind: '',
  };
  const style = meta.kind === 'Simplified structural diagram'
    ? { objectFit: 'contain', background: 'var(--surface)' }
    : undefined;

  return (
    <img
      className={className}
      style={style}
      src={`/assets/${meta.file}`}
      alt={imageLabels[name] || alt}
      width={meta.width}
      height={meta.height}
      fetchPriority={eager ? 'high' : undefined}
      loading={eager ? undefined : 'lazy'}
      decoding="async"
    />
  );
}
