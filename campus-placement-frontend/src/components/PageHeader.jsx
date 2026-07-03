export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8 fade-up">
      <div>
        {eyebrow && <p className="label-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-mist-100">{title}</h1>
        {subtitle && <p className="text-mist-500 text-sm mt-1.5 max-w-lg">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
