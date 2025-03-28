'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface SidebarProps {
  selectedMedia: MediaItem | undefined;
  onUpdateDimensions: (dimensions: { width: number; height: number }) => void;
  onUpdateTimeRange: (timeRange: { start: number; end: number }) => void;
}

export default function Sidebar({ selectedMedia, onUpdateDimensions, onUpdateTimeRange }: SidebarProps) {
  const [dimensions, setDimensions] = useState({ width: 640, height: 360 });
  const [timeRange, setTimeRange] = useState({ start: 0, end: 10 });

  useEffect(() => {
    if (selectedMedia) {
      setDimensions(selectedMedia.dimensions);
      if (selectedMedia.timeRange) {
        setTimeRange(selectedMedia.timeRange);
      }
    }
  }, [selectedMedia]);

  if (!selectedMedia) {
    return <aside className="w-80 border-r border-gray-800 p-6 bg-[#1A1A1A]" />;
  }

  const handleDimensionChange = (key: 'width' | 'height', value: number) => {
    const newDimensions = { ...dimensions, [key]: value };
    setDimensions(newDimensions);
    onUpdateDimensions(newDimensions);
  };

  const handleTimeRangeChange = (start: number, end: number) => {
    const newTimeRange = { start, end };
    setTimeRange(newTimeRange);
    onUpdateTimeRange(newTimeRange);
  };

  return (
    <aside className="w-80 border-r border-gray-800 bg-[#1A1A1A]">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Selected Media</h2>
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-800">
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  className="w-full h-full object-cover"
                  controls={false}
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Selected media"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Media Settings</h2>
            <div className="space-y-4">
              <div>
                <Label>Width</Label>
                <Input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label>Height</Label>
                <Input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>

          {selectedMedia.type === 'video' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                <div>
                  <Label>Start Time (seconds)</Label>
                  <Input
                    type="number"
                    value={timeRange.start}
                    onChange={(e) => handleTimeRangeChange(Number(e.target.value), timeRange.end)}
                    min={0}
                    step={0.1}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>End Time (seconds)</Label>
                  <Input
                    type="number"
                    value={timeRange.end}
                    onChange={(e) => handleTimeRangeChange(timeRange.start, Number(e.target.value))}
                    min={0}
                    step={0.1}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label>Timeline</Label>
                  <Slider
                    value={[timeRange.start, timeRange.end]}
                    max={30}
                    step={0.1}
                    className="mt-2"
                    onValueChange={(value) => handleTimeRangeChange(value[0], value[1])}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}