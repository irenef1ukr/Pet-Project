import { useRef } from 'react';
import type { JournalMediaType } from '../../types';
import './MediaSlot.css';

interface MediaSlotProps {
  mediaUrl: string;
  mediaType: JournalMediaType;
  onChange: (mediaUrl: string, mediaType: JournalMediaType) => void;
  height?: number;
}

export function MediaSlot({ mediaUrl, mediaType, onChange, height = 130 }: MediaSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const type: JournalMediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ''), type);
    reader.readAsDataURL(file);
  };

  return (
    <div className="media-slot" style={{ height }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        hidden
      />
      {mediaUrl ? (
        <div className="media-slot__preview">
          {mediaType === 'video' ? (
            <video src={mediaUrl} controls className="media-slot__media" />
          ) : (
            <img src={mediaUrl} alt="Attached to entry" className="media-slot__media" />
          )}
          <span
            className="media-slot__remove"
            onClick={() => onChange('', '')}
            role="button"
            tabIndex={0}
          >
            × Remove
          </span>
        </div>
      ) : (
        <div
          className="media-slot__placeholder"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          📷 Drop a photo or video
        </div>
      )}
    </div>
  );
}
