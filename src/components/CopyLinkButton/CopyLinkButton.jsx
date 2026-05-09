import { useEffect, useState } from 'react';
import { copyToClipboard } from '../../utils/clipboard';
import './copyLinkButton.css';

export const CopyLinkButton = ({ link, label = 'Copy Link', className = '', onCopied }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!link) {
      setError('No link available to copy.');
      return;
    }

    try {
      const result = await copyToClipboard(link);
      if (!result.success) {
        setError(result.message);
        setCopied(false);
        return;
      }

      setError('');
      setCopied(true);
      if (typeof onCopied === 'function') {
        onCopied(link);
      }
    } catch (copyError) {
      console.error('Copy failed', copyError);
      setError('Copy failed. Please copy manually.');
      setCopied(false);
    }
  };

  return (
    <div className={`copy-link-wrapper ${className}`.trim()}>
      <button type="button" className="copy-link-btn" onClick={handleCopy}>
        <span className="copy-link-icon" aria-hidden="true">
          {copied ? '✓' : '⎘'}
        </span>
        <span>{copied ? 'Copied!' : label}</span>
      </button>
      {copied && <span className="copy-feedback">Link copied to clipboard</span>}
      {error && <span className="copy-error">{error}</span>}
    </div>
  );
};

export default CopyLinkButton;
