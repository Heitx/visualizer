import PQueue from 'priorityqueuejs';

import INode from '@/types/node';
import { manhatten } from '@/helpers/path';

const getNeightbours = (grid: INode[][], node: INode): INode[] => {
  const { row, col } = node;
  
  const arr: INode[] = [];

  const t = row - 1; const tNode = t >= 0 ? grid[t][col] : null;
  const b = row + 1; const bNode = row + 1 < grid.length ? grid[b][col] : null;
  const r = col + 1; const rNode = col + 1 < grid[row].length ? grid[row][r] : null;
  const l = col - 1; const lNode = col - 1 >= 0 ? grid[row][l] : null;

  if (tNode && !tNode.isWall) arr.push(tNode);
  if (bNode && !bNode.isWall) arr.push(bNode);
  if (rNode && !rNode.isWall) arr.push(rNode);
  if (lNode && !lNode.isWall) arr.push(lNode);

  return arr;
};

const reconstructPath = (parentMap: Map<INode, INode>, current: INode): INode[] => {
  const path: INode[] = [];

  let tempCurrent: INode | undefined = current;
  while (tempCurrent && parentMap.has(tempCurrent)) {
    tempCurrent = parentMap.get(tempCurrent);
    if (tempCurrent) path.push(tempCurrent);
  }

  if (path.length > 0) path.pop();

  return path;
}

const astar = (grid: INode[][], start: INode, goal: INode) => {
  const pq: PQueue<INode> = new PQueue((a, b) => (b.f === a.f ? (b.h === a.h ? a.g - b.g : b.h - a.h) : b.f - a.f));
  const search: INode[] = [];
  const openSet: Set<INode> = new Set();
  const parentMap: Map<INode, INode> = new Map();

  pq.enq(start);
  start.g = 0;

  while (!pq.isEmpty()) {
    const current = pq.deq();
    openSet.delete(current);

    if (current === goal) {
      return {
        search,
        path: reconstructPath(parentMap, current)
      };
    }
    
    if (current !== start) {
      search.push(current);
    }

    const neightbours = getNeightbours(grid, current);

    neightbours.forEach((neightbour) => {
      const g = current.g + 1;
      if (g < neightbour.g) {
        parentMap.set(neightbour, current);

        neightbour.g = g;
        neightbour.h = manhatten(neightbour, goal);
        neightbour.f = neightbour.g + neightbour.h;

        if (!openSet.has(neightbour)) {
          pq.enq(neightbour);
        }
      }
    })
  }

  return null;
};

export default astar;
