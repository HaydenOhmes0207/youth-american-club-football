'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VersionBadge() {
  const searchParams = useSearchParams();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const v = searchParams.get('v');
    if (v) {
      sessionStorage.setItem('prototype-version', v);
      setVersion(v);
    } else {
      const stored = sessionStorage.getItem('prototype-version');
      setVersion(stored);
    }
  }, [searchParams]);

  if (!version) return null;

  return (
    <div className="version-badge">
      v{version}
      <style jsx>{`
        .version-badge {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 9999;
          background: #071c31;
          color: white;
          font-family: var(--u-font-body);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
