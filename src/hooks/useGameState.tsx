import { create } from 'zustand'

type Position = { x: number; y: number }

type StatePool<T extends { id: string }> = {
  entities: Record<string, T>
  ids: string[]
  actions: {
    add: (entity: T) => void
    get: (id: string) => T
  }
}

type GameState = {
  players: StatePool<{ id: string; pos: Position }>
}

export const useGameState = create<GameState>((set, get) => ({
  players: {
    entities: {},
    ids: [],
    actions: {
      add: (entity) => set(state => ({
        ...state,
        players: {
          ...state.players,
          entities: {
            ...state.players.entities,
            [entity.id]: entity
          },
          ids: [...state.players.ids, entity.id]
        }
      })),
      get: (id) => get().players.entities[id],
    },
  },
}))
