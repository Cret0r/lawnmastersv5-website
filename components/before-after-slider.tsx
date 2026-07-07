"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [afterLoaded, setAfterLoaded] = useState(false)
  const [beforeLoaded, setBeforeLoaded] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const imagesLoaded = afterLoaded && beforeLoaded

  // Track container width for proper image sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percent)
    },
    []
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      updatePosition(e.touches[0].clientX)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleEnd)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-lg cursor-col-resize select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 2))
        if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 2))
      }}
    >
      {/* Loading skeleton */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* After image (full width, sits behind) */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage || "/placeholder.svg"}
          alt="After"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          onLoad={() => setAfterLoaded(true)}
          onError={() => setAfterLoaded(true)}
        />
      </div>

      {/* Before image (clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage || "/placeholder.svg"}
          alt="Before"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ minWidth: containerWidth > 0 ? `${containerWidth}px` : "100vw" }}
          onLoad={() => setBeforeLoaded(true)}
          onError={() => setBeforeLoaded(true)}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-primary-foreground shadow-lg" />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-1/2 z-30 -translate-y-1/2"
        style={{ left: `${sliderPosition}%`, transform: `translateX(-50%) translateY(-50%)` }}
      >
        <div className={`w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center shadow-xl transition-transform ${isDragging ? "scale-110" : "hover:scale-105"}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-foreground"
          >
            <path
              d="M8 5L3 12L8 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 5L21 12L16 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Before label */}
      <div
        className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-foreground/70 text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-sm backdrop-blur-sm"
        style={{ opacity: sliderPosition > 10 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {beforeLabel}
      </div>

      {/* After label */}
      <div
        className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-primary/80 text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-sm backdrop-blur-sm"
        style={{ opacity: sliderPosition < 90 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {afterLabel}
      </div>
    </div>
  )
}
