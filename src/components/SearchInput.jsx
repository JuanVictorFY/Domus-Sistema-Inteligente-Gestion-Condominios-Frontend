import { useRef } from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Buscar...', onClear }) => {
  const ref = useRef();
  return (
    <div className="input-group">
      <span className="input-group-text bg-dark border-secondary text-secondary">
        <i className="bi bi-search"></i>
      </span>
      <input
        ref={ref}
        type="text"
        className="form-control bg-dark border-secondary text-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ caretColor: '#0dcaf0' }}
      />
      {value && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => { onChange(''); ref.current?.focus(); if (onClear) onClear(); }}
        >
          <i className="bi bi-x"></i>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
