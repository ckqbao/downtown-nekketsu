import { useGameState } from '@/hooks/useGameState'
import { useExtend, useSuspenseAssets, useTick } from '@pixi/react'
import { AnimatedSprite, Spritesheet } from 'pixi.js'
import { useEffect, useRef } from 'react'

const bounds = { x: 0, y: 160, w: 320, h: 64 }

export function PlayerCharacter() {
  useExtend({ AnimatedSprite })

  const spriteRef = useRef<AnimatedSprite>(null)
  const keyStateRef = useRef<Record<string, boolean>>({})

  const [spriteSheet] = useSuspenseAssets<Spritesheet>(['./assets/pc/atlas.json'])
  const standAnimation = spriteSheet.animations['stand']
  const walkAnimation = spriteSheet.animations['walk']
  const punchAnimation = spriteSheet.animations['punch']
  const kickAnimation = spriteSheet.animations['kick']

  const { players } = useGameState()

  useEffect(() => {
    players.actions.add({ id: 'player', pos: { x: 64, y: 128 }})
  }, [players.actions])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const keyState = keyStateRef.current
      keyState[event.key] = true
    }

    function onKeyUp(event: KeyboardEvent) {
      const keyState = keyStateRef.current
      keyState[event.key] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keydown', onKeyUp)
    }
  }, [spriteSheet])

  useTick((ticker) => {
    const keyState = keyStateRef.current
    const sprite = spriteRef.current
    if (!sprite) return
    
    sprite.animationSpeed = 0.15
    sprite.loop = false
    
    // punch
    if (keyState['a']) {
      if (sprite.playing && sprite.textures !== punchAnimation) {
        sprite.stop()
        sprite.textures = punchAnimation
        sprite.play()
      } else if (!sprite.playing) {
        sprite.textures = punchAnimation
        sprite.play()
      }
    }
    if (sprite.textures === punchAnimation && sprite.playing) return

    // kick
    if (keyState['s']) {
      if (sprite.playing && sprite.textures !== kickAnimation) {
        sprite.stop()
        sprite.textures = kickAnimation
        sprite.play()
      } else if (!sprite.playing) {
        sprite.textures = kickAnimation
        sprite.play()
      }
    }
    if (sprite.textures === kickAnimation && sprite.playing) return

    // walk
    if (keyState['ArrowLeft']) {
      if (!sprite.playing) {
        sprite.textures = walkAnimation
        sprite.play()
      }
      sprite.scale.x = -1
      sprite.x -= ticker.deltaTime
    }
    if (keyState['ArrowRight']) {
      if (!sprite.playing) {
        sprite.textures = walkAnimation
        sprite.play()
      }
      sprite.scale.x = 1
      sprite.x += ticker.deltaTime
    }
    if (keyState['ArrowDown']) {
      if (!sprite.playing) {
        sprite.textures = walkAnimation
        sprite.play()
      }
      sprite.y += ticker.deltaTime
    }
    if (keyState['ArrowUp']) {
      if (!sprite.playing) {
        sprite.textures = walkAnimation
        sprite.play()
      }
      sprite.y -= ticker.deltaTime
    }

    // default animation
    if (Object.keys(keyState).every(key => !keyState[key])) {
      if (sprite.playing) sprite.stop()
      if (sprite.textures !== standAnimation) sprite.textures = standAnimation
    }
    
    // Boundaries
    sprite.x = Math.max(sprite.x, bounds.x)
    sprite.x = Math.min(sprite.x, bounds.x + bounds.w)
    sprite.y = Math.max(sprite.y, bounds.y)
    sprite.y = Math.min(sprite.y, bounds.y + bounds.h)
    sprite.zIndex = sprite.y
    // players.actions.set('player', { pos: { x: player.x, y: player.y }})
    const player = players.actions.get('player')
    player.pos.x = sprite.x
    player.pos.y = sprite.y
  })

  return <animatedSprite ref={spriteRef} anchor={{ x: 0.5, y: 1 }} textures={standAnimation} x={64} y={128} />
}
