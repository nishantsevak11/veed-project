'use client';

import { useState, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Canvas from '@/components/Canvas';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

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

export default function Home() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please upload a video or image file');
      return;
    }

    const newItem: MediaItem = {
      id: Math.random().toString(36).substring(7),
      file,
      type: isVideo ? 'video' : 'image',
      url: URL.createObjectURL(file),
      dimensions: {
        width: 640,
        height: 360
      },
      ...(isVideo && { timeRange: { start: 0, end: 10 } })
    };

    setMediaItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);

    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const selectedMedia = mediaItems.find(item => item.id === selectedItemId);

  const updateMediaDimensions = (id: string, dimensions: { width: number; height: number }) => {
    setMediaItems(prev => prev.map(item => 
      item.id === id ? { ...item, dimensions } : item
    ));
  };

  const updateMediaTimeRange = (id: string, timeRange: { start: number; end: number }) => {
    setMediaItems(prev => prev.map(item => 
      item.id === id ? { ...item, timeRange } : item
    ));
  };

  const handleAddMedia = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) {
      const remainingItems = mediaItems.filter(item => item.id !== id);
      setSelectedItemId(remainingItems.length > 0 ? remainingItems[0].id : null);
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <Header />
      <div className="flex">
        <Sidebar 
          selectedMedia={selectedMedia} 
          onUpdateDimensions={(dimensions) => selectedItemId && updateMediaDimensions(selectedItemId, dimensions)}
          onUpdateTimeRange={(timeRange) => selectedItemId && updateMediaTimeRange(selectedItemId, timeRange)}
        />
        <div className="flex-1 p-8">
          {mediaItems.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
              <label 
                className={cn(
                  "flex flex-col items-center justify-center w-96 h-64",
                  "border-2 border-dashed border-gray-600 rounded-lg",
                  "cursor-pointer transition-all duration-300",
                  "hover:border-[#00A3FF] hover:bg-[#00A3FF]/5"
                )}
              >
                <Upload className="w-12 h-12 mb-4 text-[#00A3FF]" />
                <span className="text-lg font-medium mb-2">Upload a file</span>
                <span className="text-sm text-gray-400">
                  Drop your video or image here
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            <div className="relative h-[calc(100vh-8rem)]">
              <Canvas 
                mediaItems={mediaItems}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onUpdateDimensions={updateMediaDimensions}
                onDeleteItem={handleDeleteMedia}
              />
             
            </div>
          )}
        </div>
      </div>
    </main>
  );
}