export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-mist-500">
      <div className="w-4 h-4 rounded-full border-2 border-signal-violet/30 border-t-signal-violet animate-spin" />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  )
}
