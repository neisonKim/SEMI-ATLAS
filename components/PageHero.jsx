import AssetImage from './AssetImage';

export default function PageHero({ eyebrow, title, description, image, action = null }) {
  return (
    <section className="page-hero">
      <AssetImage name={image} alt={typeof title === 'string' ? title : ''} className="page-hero-image" eager />
      <div className="container page-hero-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {action}
      </div>
    </section>
  );
}
