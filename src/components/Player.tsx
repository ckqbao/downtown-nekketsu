import { useExtend, useSuspenseAssets, useTick } from '@pixi/react'
import { AnimatedSprite, Spritesheet } from 'pixi.js'
import { useEffect, useMemo, useRef } from 'react'

export function Player() {
  useExtend({ AnimatedSprite })

  const playerRef = useRef<AnimatedSprite>(null)
  const keyStateRef = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean }>({ up: false, down: false, left: false, right: false })

  const [spriteSheet] = useSuspenseAssets<Spritesheet>(['./assets/player/atlas.json'])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!playerRef.current) return
      switch (event.key) {
        case 'ArrowDown':
          // standingSpriteRef.current.y += 1
          keyStateRef.current.down = true
          break
        case 'ArrowUp':
          // Do something for "up arrow" key press.
          keyStateRef.current.up = true
          break
        case 'ArrowLeft':
          // Do something for "left arrow" key press.
          keyStateRef.current.left = true
          break
        case 'ArrowRight':
          // Do something for "right arrow" key press.
          keyStateRef.current.right = true
          break
        default:
          console.log("Don't know that key: " + event.key)
          break
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      const player = playerRef.current
      if (!player) return
      switch (event.key) {
        case 'ArrowDown':
          // standingSpriteRef.current.y += 1
          keyStateRef.current.down = false
          if (player.playing) player.gotoAndStop(0)
          break
        case 'ArrowUp':
          // Do something for "up arrow" key press.
          keyStateRef.current.up = false
          if (player.playing) player.gotoAndStop(0)
          break
        case 'ArrowLeft':
          // Do something for "left arrow" key press.
          keyStateRef.current.left = false
          if (player.playing) player.gotoAndStop(0)
          break
        case 'ArrowRight':
          // Do something for "right arrow" key press.
          keyStateRef.current.right = false
          if (player.playing) player.gotoAndStop(0)
          break
        default:
          console.log("Don't know that key: " + event.key)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keydown', onKeyUp)
    }
  }, [])

  useTick((ticker) => {
    const player = playerRef.current
    if (!player) return

    player.animationSpeed = 0.25
    if (keyStateRef.current.left) {
      if (!player.playing) {
        player.play()
      }
      player.x -= ticker.deltaTime
    }
    if (keyStateRef.current.right) {
      if (!player.playing) {
        player.play()
      }
      player.x += ticker.deltaTime
    }
    if (keyStateRef.current.down) {
      if (!player.playing) {
        player.play()
      }
      player.y += ticker.deltaTime
    }
    if (keyStateRef.current.up) {
      if (!player.playing) {
        player.play()
      }
      player.y -= ticker.deltaTime
    }
  })

  return <animatedSprite ref={playerRef} textures={spriteSheet.animations['walk']} />
}
