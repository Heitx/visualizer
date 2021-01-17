import { exBetweenInt } from "@/helpers/random";
import INode from "@/types/node";

enum Orientation {
  VERTICAL,
  HORIZONTAL,
}

const chooseOrientation = (width: number, height: number): Orientation => {
  if (width < height)
    return Orientation.HORIZONTAL;
  else if (height < width)
    return Orientation.VERTICAL;
  else
    return exBetweenInt(0, 2) === 0 ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

const divide = (grid: INode[][], x: number, y: number, width: number, height: number, orientation: Orientation, sequence: Array<Set<INode>>) => {
  if (width < 2 || height < 2) return;

  const isHorizontal = orientation === Orientation.HORIZONTAL;

  let wx = x + (isHorizontal ? 0 : exBetweenInt(0, width - 2));
  let wy = y + (isHorizontal ? exBetweenInt(0, height - 2) : 0);

  const hx = wx + (isHorizontal ? exBetweenInt(0, width) : 0);
  const hy = wy + (isHorizontal ? 0 : exBetweenInt(0, height));

  const length = isHorizontal ? width : height;

  const [dx, dy] = isHorizontal ? [1, 0] : [0, 1];

  // const seqSet = new Set<INode>();
  for(let l = 0; l < length; l++) {
    console.log(wy, wx);
    const cell = grid[wy][wx];
    if (!cell.isStart && !cell.isGoal)
      cell.isWall = true;
    // seqSet.add(cell);

    wx += dx;
    wy += dy;
  }

  const hole = grid[hy][hx];
  hole.isWall = false;
  // seqSet.delete(hole);
  // sequence.push(seqSet);

  const [nx1, ny1] = [x, y];
  const [nw1, nh1] = isHorizontal ? [width, wy - y] : [wx - x, height];
  divide(grid, nx1, ny1, nw1, nh1, chooseOrientation(nw1, nh1), sequence);

  const [nx2, ny2] = isHorizontal ? [x, wy + 1] : [wx + 1, y];
  const [nw2, nh2] = isHorizontal ? [width, y + height - wy - 1] : [x + width - wx - 1, height];
  divide(grid, nx2, ny2, nw2, nh2, chooseOrientation(nw2, nh2), sequence);
}

const recursiveDivision = (grid: INode[][]) => {
  const width = grid[0].length;
  const height = grid.length;

  const sequence: Array<Set<INode>> = [];

  divide(grid, 0, 0, width, height, chooseOrientation(width, height), sequence);

  return sequence;
};

export default recursiveDivision;

// const divide = (grid: INode[][], x: number, y: number, width: number, height: number, orientation: Orientation, sequence: Array<Set<INode>>) => {
//   if (width < 2 || height < 2) return;

//   const horizontal = orientation === Orientation.HORIZONTAL;

//   // wall location
//   let wx = x + (horizontal ? 0 : 2 + Math.floor(Math.random() * (width - 4)));
//   let wy = y + (horizontal ? 2 + Math.floor(Math.random() * (height - 4)) : 0);
//   // opening location
//   const hx = wx + (horizontal ? Math.floor(Math.random() * (width)) : 0);
//   const hy = wy + (horizontal ? 0 : Math.floor(Math.random() * (height)));

//   const dx = horizontal ? 1 : 0;
//   const dy = horizontal ? 0 : 1;

//   const length = horizontal ? width : height;
//   const seqSet: Set<INode> = new Set();
//   for(let l = 0; l < length; l++) {
//     const node = grid[wy][wx];
//     if (!node.isStart && !node.isGoal)
//       seqSet.add(node);

//     wx += dx;
//     wy += dy;
//   }

//   seqSet.delete(grid[hy][hx]);
//   sequence.push(seqSet);

//   const [nx1, ny1] = [x, y];
//   const [nw1, nh1] = horizontal ? [width, wy - y] : [wx - x, height];
//   divide(grid, nx1, ny1, nw1, nh1, chooseOrientation(nw1, nh1), sequence);

//   const [nx2, ny2] = horizontal ? [x, wy + 1] : [wx + 1, y];
//   const [nw2, nh2] = horizontal ? [width, y + height - wy - 1] : [x + width - wx - 1, height];
//   divide(grid, nx2, ny2, nw2, nh2, chooseOrientation(nw2, nh2), sequence);
// }