'use client';

import { FileVideo, Settings, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-800 px-6 flex items-center justify-between bg-[#1A1A1A]">
      <div className="flex items-center space-x-2">
        <FileVideo className="w-8 h-8 text-[#00A3FF]" />
        <span className="text-xl font-semibold">VideoDubber</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button className="bg-[#00A3FF] hover:bg-[#0082CC]">
          <Share2 className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </header>
  );
}