"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string | null
  projectTitle: string | null
}

export function VideoModal({ isOpen, onClose, videoUrl, projectTitle }: VideoModalProps) {
  if (!videoUrl) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] bg-gray-900 border-gray-700 p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {projectTitle || "Project Video"}
        </DialogTitle>
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 transition-colors"
            aria-label="Close video"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Video Title */}
          {projectTitle && (
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 max-w-[calc(100%-120px)]">
              <h3 className="text-lg font-semibold text-white">{projectTitle}</h3>
            </div>
          )}
          
          {/* Video Player */}
          <div className="relative bg-black flex items-center justify-center w-full aspect-video">
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted
              loop
              key={videoUrl}
            >
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
