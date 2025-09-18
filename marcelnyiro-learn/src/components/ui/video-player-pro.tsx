"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize2, RotateCw, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";

interface VideoPlayerProProps {
  src: string;
  onVideoComplete?: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPlayerPro: React.FC<VideoPlayerProProps> = ({ src, onVideoComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [hasCompletedVideo, setHasCompletedVideo] = useState<boolean>(false);

  // Reset completion state when video source changes
  React.useEffect(() => {
    setHasCompletedVideo(false);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsEnded(false);
  }, [src]);

  // Play / Pause / Restart
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isEnded) {
      videoRef.current.currentTime = 0;
      setIsEnded(false);
    }
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress and time
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isFinite(prog) ? prog : 0);
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
    
    // Check if video reached 90% completion for marking as watched
    if (prog >= 90 && !hasCompletedVideo && onVideoComplete) {
      setHasCompletedVideo(true);
      onVideoComplete();
    }
  };

  // Video ended
  const handleEnded = () => {
    setIsEnded(true);
    setIsPlaying(false);
    
    // Also mark as complete if video fully ends
    if (!hasCompletedVideo && onVideoComplete) {
      setHasCompletedVideo(true);
      onVideoComplete();
    }
  };

  // Seek
  const handleSeek = (percent: number) => {
    if (!videoRef.current) return;
    const time = (percent / 100) * (videoRef.current.duration || 0);
    if (isFinite(time)) videoRef.current.currentTime = time;
    setProgress(percent);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    // Must be called inside a user-initiated event
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen failed:", err);
      });
    }
  };

  // Toggle mute
  // const toggleMute = () => {
  //   if (!videoRef.current) return;
  //   videoRef.current.muted = !isMuted;
  //   setIsMuted(!isMuted);
  //   setVolume(!isMuted ? 0 : 1);
  //   if (!isMuted) videoRef.current.volume = 0;
  //   else videoRef.current.volume = 1;
  // };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl bg-black shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-black/30 rounded-xl p-4 border border-white/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress */}
            <div
              className="relative w-full h-2 bg-white/30 rounded-full cursor-pointer mb-3 group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                handleSeek((x / rect.width) * 100);
              }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-white rounded-full shadow-sm"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, marginLeft: '-8px' }}
              />
            </div>

            {/* Control Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play / Pause / Restart */}
                <button 
                  className="text-white hover:scale-110 transition-transform p-1" 
                  onClick={togglePlay}
                >
                  {isEnded ? <RotateCw className="w-5 h-5" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                {/* Volume */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-white hover:scale-110 transition-transform p-1">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : volume > 0.5 ? <Volume2 className="w-5 h-5" /> : <Volume1 className="w-5 h-5" />}
                    </button>
                  </PopoverTrigger>
                    <PopoverContent className="w-32 bg-black/80 backdrop-blur-xl border-white/20 p-3">
                      <Slider
                        value={[volume * 100]}  
                        onValueChange={(val: number[]) => {
                          const newVolume = val[0] / 100;
                          if (videoRef.current) videoRef.current.volume = newVolume;
                          setVolume(newVolume);
                          setIsMuted(newVolume === 0);
                        }}
                        step={1}
                        min={0}
                        max={100}
                        className="relative flex h-2 w-full touch-none select-none items-center"
                      />
                    </PopoverContent>
                </Popover>

                {/* Timer */}
                <span className="text-white text-sm font-medium tabular-nums ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Settings */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-white hover:scale-110 transition-transform p-1">
                      <Settings className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-black/80 backdrop-blur-xl border-white/20 w-40 p-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">Speed</span>
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          className={`w-full px-3 py-1.5 rounded-lg text-sm transition-all ${
                            playbackSpeed === s 
                              ? "bg-white text-black font-semibold" 
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                          onClick={() => {
                            if (videoRef.current) videoRef.current.playbackRate = s;
                            setPlaybackSpeed(s);
                          }}
                        >
                          {s}x
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-white/60 uppercase tracking-wide mt-2">Captions</span>
                      <button className="w-full px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm transition-all">
                        Off
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Fullscreen */}
                <button 
                  className="text-white hover:scale-110 transition-transform p-1" 
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayerPro;
