import { Application, useExtend } from '@pixi/react'
import { Suspense, useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import { AbstractRenderer, Container, Text, TextureSource } from 'pixi.js'
import { Background } from './components/Background'
import { Player } from './components/Player'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants'

// Default global pixi settings
TextureSource.defaultOptions.scaleMode = 'nearest'
AbstractRenderer.defaultOptions.roundPixels = true

function Game() {
  useExtend({ Container })

  return (
    <container label="Game">
      <Background />
      <Player />
    </container>
  )
}

function App() {
  useExtend({ Text })
  const [isInitialized, setIsInitialized] = useState(false)

  return (
    <Application
      onInit={() => {
        setIsInitialized(true)
      }}
      preference="webgpu"
      // backgroundColor="#000"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    >
      {isInitialized && (
        <ErrorBoundary>
          <Suspense fallback={<pixiText text="Loading..." />}>
            <Game />
          </Suspense>
        </ErrorBoundary>
      )}
    </Application>
  )
}

export default App
