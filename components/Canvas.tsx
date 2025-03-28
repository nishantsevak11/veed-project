'use client';

import { useRef, useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Draggable from 'react-draggable';

interface MediaItem {
  id: string;
  file: File;
  type: 'video' | 'image';
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  timeRange?: {
    start: number;
    end: number;
  };
}

interface CanvasProps {
  mediaItems: MediaItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onUpdateDimensions: (id: string, dimensions: { width: number; height: number }) => void;
  onDeleteItem: (id: string) => void;
}

export default function Canvas({ 
  mediaItems, 
  selectedItemId, 
  onSelectItem, 
  onUpdateDimensions,
  onDeleteItem 
}: CanvasProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const selectedVideo = mediaItems.find(item => item.type === 'video' && item.timeRange);
          if (selectedVideo?.timeRange && prev >= selectedVideo.timeRange.end) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return selectedVideo.timeRange.start;
          }
          return prev + 0.1;
        });
      }, 100);
      setIsPlaying(true);
    }
  };

  const isMediaVisible = (item: MediaItem) => {
    if (item.type === 'image') return true;
    if (!item.timeRange) return true;
    return currentTime >= item.timeRange.start && currentTime <= item.timeRange.end;
  };

  return (
    <div className="relative h-full bg-[#121212] rounded-lg">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
        {mediaItems.some(item => item.type === 'video') && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12"
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <PauseCircle className="w-8 h-8" />
              ) : (
                <PlayCircle className="w-8 h-8" />
              )}
            </Button>
            <div className="bg-gray-800 px-4 py-2 rounded-md">
              {currentTime.toFixed(1)}s
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {mediaItems.map((item) => (
          <Draggable
            key={item.id}
            bounds="parent"
            onMouseDown={() => onSelectItem(item.id)}
          >
            <div
              className={`absolute ${selectedItemId === item.id ? 'z-10' : 'z-0'}`}
              style={{ width: item.dimensions.width, height: item.dimensions.height }}
            >
              {selectedItemId === item.id && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> 
                </Button>
              )}
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls={false}
                />
              ) : (
                <img
                  src={item.url}
                  alt="Uploaded media"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
