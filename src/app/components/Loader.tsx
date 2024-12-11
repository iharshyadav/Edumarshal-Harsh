import React from 'react'

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="absolute w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"
              style={{
                animationDuration: `${1.5 + index * 0.5}s`,
                animationDelay: `${index * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-accent opacity-20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold gradient-text glitch" data-text="Loading">Loading</p>
        <p className="mt-2 text-muted-foreground">Preparing your dashboard...</p>
      </div>
    </div>
  )
}