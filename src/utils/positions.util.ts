import { PointData } from 'pixi.js'

export function getPointsDistance(pos1: PointData, pos2: PointData) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
}
