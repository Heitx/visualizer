export default interface INode {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isGoal: boolean;
  isVisited: boolean;
  g: number;
  h: number;
  f: number;
}
