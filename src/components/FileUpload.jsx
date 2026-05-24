import { useRef, useState } from 'react';
import { bytesToHuman } from '../utils/format.js';

const FileUpload = ({ accept = '*', maxSizeMB = 5, onFile, label = 'Seleccionar archivo' }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    setError(null);
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera el límite de ${maxSizeMB} MB.`);
      return;
    }
    setFile(f);
    onFile?.(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <div
        className={`border rounded-3 p-4 text-center ${dragging ? 'border-info bg-info bg-opacity-10' : 'border-secondary'}`}
        style={{ cursor: 'pointer', borderStyle: 'dashed', transition: 'all 0.2s' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <i className="bi bi-cloud-upload text-secondary" style={{ fontSize: '2rem' }}></i>
        <p className="text-secondary mb-1 mt-2">{file ? file.name : label}</p>
        {file && <small className="text-secondary">{bytesToHuman(file.size)}</small>}
        {!file && <small className="text-secondary">o arrastra y suelta aquí</small>}
      </div>
      {error && <p className="text-danger mt-2 mb-0" style={{ fontSize: '0.85rem' }}>{error}</p>}
      <input ref={inputRef} type="file" accept={accept} className="d-none" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
    </div>
  );
};

export default FileUpload;
