import PQueue from 'priorityqueuejs';

import INode from "@/types/node";

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

const dijkstra = (grid: INode[][], start: INode, goal: INode) => {
  const search = new Array<INode>();
  const parentMap = new Map<INode, INode>();
  const distance = new Map<INode, number>();
  const visited = new Set<INode>();
  const pq = new PQueue<INode>((a, b) => {
    const bDist = distance.get(a);
    const aDist = distance.get(b);

    return (aDist === undefined ? Infinity : aDist) - (bDist === undefined ? Infinity : bDist);
  });

  pq.enq(start);
  distance.set(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.deq();

    if (current === goal) {
      return {
        search,
        path: reconstructPath(parentMap, current)
      };
    }

    if (current !== start) {
      search.push(current);
    }

    if (!visited.has(current)) visited.add(current);

    const neightbours = getNeightbours(grid, current);

    neightbours.forEach((neightbour) => {
      const cDist = distance.get(current);
      const nDist = distance.get(neightbour);

      const alt = (cDist === undefined ? Infinity : cDist) + 1;
      const dist = (nDist === undefined ? Infinity : nDist);
;
      if (alt < dist) {
        if (!visited.has(neightbour)) pq.enq(neightbour);
        distance.set(neightbour, alt);
        parentMap.set(neightbour, current);
      }
    });
  }

  return null;
}

export default dijkstra;