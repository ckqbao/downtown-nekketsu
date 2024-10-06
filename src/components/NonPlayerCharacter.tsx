import { BACKGROUND_BOUNDS } from '@/constants'
import { useGameState } from '@/hooks/useGameState'
import { getPointsDistance } from '@/utils/positions.util'
import { useApplication, useExtend, useSuspenseAssets, useTick } from '@pixi/react'
import { AnimatedSprite, Spritesheet } from 'pixi.js'
import { useRef } from 'react'

export function NonPlayerCharacter() {
  useExtend({ AnimatedSprite })

  const npcRef = useRef<AnimatedSprite>(null)

  const { app } = useApplication()
  const [spriteSheet] = useSuspenseAssets<Spritesheet>(['./assets/npc/atlas.json'])
  const standAnimation = spriteSheet.animations['stand']
  const walkAnimation = spriteSheet.animations['walk']
  const punchAnimation = spriteSheet.animations['punch']
  const kickAnimation = spriteSheet.animations['kick']

  const players = useGameState((state) => state.players)

  useTick((tick) => {
    const npc = npcRef.current
    if (!npc) return

    npc.animationSpeed = 0.1

    npc.x = Math.max(npc.x, BACKGROUND_BOUNDS.x)
    npc.x = Math.min(npc.x, BACKGROUND_BOUNDS.x + BACKGROUND_BOUNDS.w)
    npc.y = Math.max(npc.y, BACKGROUND_BOUNDS.y)
    npc.y = Math.min(npc.y, BACKGROUND_BOUNDS.y + BACKGROUND_BOUNDS.h)

    let nearestPlayerId = players.ids[0]
    for (const playerId of players.ids) {
      if (nearestPlayerId === playerId) continue
      const nearestPlayer = players.entities[nearestPlayerId]
      const player = players.entities[playerId]
      if (getPointsDistance(npc.position, player.pos) < getPointsDistance(npc.position, nearestPlayer.pos)) {
        nearestPlayerId = playerId
      }
    }

    const nearestPlayer = players.entities[nearestPlayerId]
    if (nearestPlayer && Math.abs(npc.x - nearestPlayer.pos.x) > npc.width) {
      const factorX = nearestPlayer.pos.x > npc.x ? 1 : -1
      if (!npc.playing) {
        npc.textures = walkAnimation
        npc.play()
      }
      npc.scale.x = factorX
      npc.x += tick.deltaTime * 0.5 * factorX
    }
    if (nearestPlayer && Math.abs(npc.y - nearestPlayer.pos.y) > 0.1) {
      const factorY = nearestPlayer.pos.y > npc.y ? 1 : -1
      if (!npc.playing) {
        npc.textures = walkAnimation
        npc.play()
      }
      npc.y += tick.deltaTime * 0.5 * factorY
    }
    npc.zIndex = npc.y -1
    if (nearestPlayer &&  Math.abs(npc.x - nearestPlayer.pos.x) < npc.width && Math.abs(npc.y - nearestPlayer.pos.y) < 0.1) {
      if (npc.playing) npc.stop()
      npc.textures = standAnimation
    }
  })

  return <animatedSprite ref={npcRef} anchor={{ x: 0.5, y: 1 }} textures={standAnimation} x={128} y={96} />
}
