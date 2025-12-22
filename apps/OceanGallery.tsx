import React from 'react';
import { Icon } from '../components/Icon';

interface OceanGalleryProps {
  onShare?: () => void;
}

const IMAGES = [
  'https://picsum.photos/800/600?random=1&grayscale',
  'https://picsum.photos/800/600?random=2&blur=2',
  'https://picsum.photos/800/600?random=3',
  'https://picsum.photos/800/600?random=4',
  'https://picsum.photos/800/600?random=5',
  'https://picsum.photos/800/600?random=6',
];

export const OceanGallery: React.FC<OceanGalleryProps> = ({ onShare }) => {
  return (
    <div className="h-full bg-black overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
      {IMAGES.map((src, idx) => (
        <div key={idx} className="aspect-square relative group overflow-hidden rounded-lg border border-white/10 cursor-pointer">
          <img 
            src={src} 
            alt={`Gallery ${idx}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
            <span className="text-xs text-white font-medium drop-shadow-md">Image {idx + 1}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onShare) onShare();
              }}
              className="p-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg backdrop-blur-sm border border-white/10 hover:scale-105 active:scale-95"
              title="Share via Shark Share"
            >
              <Icon name="Share2" size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};