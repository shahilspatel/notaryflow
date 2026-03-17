'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
