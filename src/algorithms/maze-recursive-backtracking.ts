import INode from "@/types/node";

/*
  NOT FOR FOR ALL ADDERS
  UNTIL I FIND A SOLUTION!
*/

const T = 2, B = 4, R = 8, L = 16;

const DX: Map<number, number> = new Map([[T, 0], [B, 0], [R, 1], [L, -1]]);
const DY: Map<number, number> = new Map([[T, -1], [B, 1], [R, 0], [L, 0]]);
const OPPOSITE: Map<number, number> = new Map([[T, B], [B, T], [R, L], [L, R]]);

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = (array: any[]) => {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      const index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter -= 1;

      // And swap the last element with it
      const temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}

const carve = (grid: INode[][], curr: INode, visited: Map<INode, number>) => {
  const directions = shuffle([T, B, R, L]);

  directions.forEach((d) => {
    const nx = curr.col + DX.get(d)!;
    const ny = curr.row + DY.get(d)!;

    if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length && !visited.has(grid[ny][nx])) {
      const node = grid[ny][nx];

      const valCurr = visited.get(curr);
      const valNode = visited.get(node);
      visited.set(curr, (valCurr ? valCurr : 0) | d);
      visited.set(node, (valNode ? valNode : 0) | OPPOSITE.get(d)!);

      carve(grid, node, visited);
    }
  })
}

const recursiveBacktracking = (grid: INode[][]) => {
  // const startRow = Math.floor(Math.random() * grid.length - 1);
  // const startCol = Math.floor(Math.random() * grid[0].length - 1);

  const start = grid[0][0];

  const visited: Map<INode, number> = new Map();

  carve(grid, start, visited);

  console.log(visited);
};

export default recursiveBacktracking;
