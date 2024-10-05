import { useRef } from 'react'
import { useExtend, useSuspenseAssets } from '@pixi/react'
import { Sprite, Texture } from 'pixi.js'

export function Background() {
  useExtend({ Sprite })

  const spriteRef = useRef<Sprite>(null)

  const [background] = useSuspenseAssets<Texture>(['./assets/backgrounds/rivercity-school.png'])

  return <sprite ref={spriteRef} scale={1.5} texture={background} />
}
