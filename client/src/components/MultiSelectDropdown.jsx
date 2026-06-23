import { useState, useRef, useEffect } from 'react';
import './MultiSelectDropdown.css';

export default function MultiSelectDropdown({ options, selected, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o._id))
    .map((o) => o.name)
    .join(', ');

  return (
    <div ref={ref} className="multi-select">
      <button
        type="button"
        className={`dropdown-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="dropdown-label">
          {selectedLabels || placeholder || 'Select...'}
        </span>
        <span className={`dropdown-arrow ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <label key={opt._id} className="dropdown-option">
              <input
                type="checkbox"
                checked={selected.includes(opt._id)}
                onChange={() => toggle(opt._id)}
              />
              <span>{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}