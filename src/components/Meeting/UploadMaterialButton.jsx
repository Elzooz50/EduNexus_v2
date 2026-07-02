// src/components/Meeting/UploadMaterialButton.jsx

import { FileUp, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadLectureMaterial } from '../../services/meetingApi';

export function UploadMaterialButton({ meetingId, onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function handleFile(f) {
    setErr(null);
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErr('Only PDF files are allowed.');
      return;
    }
    setBusy(true);
    try {
      const result = await uploadLectureMaterial(f, meetingId);
      onUploaded?.(result.fileUrl, result.fileName);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Upload lecture PDF"
        className="flex flex-col items-center justify-center w-16 h-14 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs gap-1 disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
        <span>PDF</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {err && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-600 text-white text-xs px-3 py-1 rounded-md shadow">
          {err}
        </div>
      )}
    </>
  );
}
