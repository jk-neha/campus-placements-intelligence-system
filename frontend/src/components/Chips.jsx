export function ChipList({ items = [], missing = false, empty = "None listed" }) {
  if (!items.length) return <span className="stat-caption">{empty}</span>;
  return (
    <div className="chip-list">
      {items.map((item, i) => (
        <span key={item + i} className={`chip ${missing ? "chip-missing" : ""}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

// Editable chip input backed by a comma-separated string value (matches the
// backend's `skills` / `required_skills` storage format).
export function ChipInput({ value, onChange, placeholder = "Type a skill and press Enter" }) {
  const items = value
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const addChip = (raw) => {
    const v = raw.trim();
    if (!v) return;
    if (items.some((i) => i.toLowerCase() === v.toLowerCase())) return;
    onChange([...items, v].join(","));
  };

  const removeChip = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    onChange(next.join(","));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(e.target.value);
      e.target.value = "";
    } else if (e.key === "Backspace" && e.target.value === "" && items.length) {
      removeChip(items.length - 1);
    }
  };

  return (
    <div className="chip-input-box">
      {items.map((item, i) => (
        <span key={item + i} className="chip">
          {item}
          <button type="button" onClick={() => removeChip(i)} aria-label={`Remove ${item}`}>
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={items.length ? "" : placeholder}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          addChip(e.target.value);
          e.target.value = "";
        }}
      />
    </div>
  );
}
