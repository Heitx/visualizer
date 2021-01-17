import INode from "@/types/node";

export const manhatten = (start: INode, goal: INode) => Math.abs(start.row - goal.row) + Math.abs(start.col - goal.col);

export const test = () => undefined;
