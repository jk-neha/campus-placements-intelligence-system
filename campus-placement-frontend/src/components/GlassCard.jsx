export default function GlassCard({ children, className = '', strong = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`${strong ? 'glass-panel-strong' : 'glass-panel'} p-5 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
