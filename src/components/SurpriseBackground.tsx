'use client'

import { useState, useEffect } from 'react'

export default function SurpriseBackground() {
  const [bgImage, setBgImage] = useState<string | null>(null)

  useEffect(() => {
    // 1. Generate a random number to trick the browser into never caching the image
    const cacheBuster = Math.random()

    // 2. Pick your favorite random image provider:

    // OPTION A: Completely 100% random anything (Uncomment this to use)
    // const randomUrl = `https://picsum.photos/1920/1080?random=${cacheBuster}`

    // OPTION B: Random, but restricted to nice themes like "nature" or "landscape" (Recommended)
    const randomUrl = `https://loremflickr.com/1920/1080/nature,landscape?random=${cacheBuster}`

    // Set the image
    setBgImage(randomUrl)
  }, [])

  // Show nothing while the client is deciding the URL
  if (!bgImage) return null

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      
      {/* The Random Wallpaper from the Internet */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* The Glassmorphism Overlay 
          (This is extremely important now! Because the image is truly random, 
          it might be pure white or pure black. This frosted glass layer ensures 
          your text is ALWAYS readable in Hell or Dunkel mode!) 
      */}
      <div className="absolute inset-0 bg-white/85 dark:bg-gray-950/85 backdrop-blur-sm transition-colors duration-300" />
      
    </div>
  )
}