export function Loader({ label = "Loading records…" }) {
  return (
    <div className="loader-row">
      <span className="spinner" />
      {label}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", hint, mark = "—" }) {
  return (
    <div className="empty-state">
      <div className="emoji-mark">{mark}</div>
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="error-banner">{message}</div>;
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return <div className="success-banner">{message}</div>;
}
