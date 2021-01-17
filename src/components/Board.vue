<template>
  <div class="board" @contextmenu="$event.preventDefault()">
    <div class="grid" ref="grid">
      <div
        class="row"
        v-for="(row, rIndex) in grid"
        :id="`row-${rIndex}`"
        :key="`row-${rIndex}`"
      >
        <Node
          v-for="(cell, cIndex) in row"
          :key="`row-${rIndex}-${cIndex}`"
          :row="cell.row"
          :col="cell.col"
          :isWall="cell.isWall"
          :isStart="cell.isStart"
          :isGoal="cell.isGoal"
          @wall:on="toggleWall($event, true)"
          @wall:off="toggleWall($event, false)"
          @node:capture="handleCapture"
          @node:release="handleRelease"
          @node:move="handleNodeMove"
        ></Node>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Position from '@/types/position';
import INode from '@/types/node';
import Node from './Node.vue';

export default defineComponent({
  name: 'Board',
  props: {},
  data() {
    return {
      grid: [] as INode[][],
      startNode: {} as INode,
      goalNode: {} as INode,
      isDragging: false,
      startNodeTemp: undefined as INode | undefined,
      goalNodeTemp: undefined as INode | undefined,
    };
  },
  components: {
    Node,
  },
  methods: {
    generateMaze() {
      // console.log('Generate Mazes WIP.');
    },
    reset(): void {
      this.initGrid();

      this.startNode = this.grid[4][4];
      this.goalNode = this.grid[this.grid.length - 5][this.grid[0].length - 5];

      this.startNode.isStart = true;
      this.goalNode.isGoal = true;
    },
    resetWalls(): void {
      for (let row = 0; row < this.grid.length; row++)
        for (let col = 0; col < this.grid[row].length; col++)
          this.grid[row][col].isWall = false;
    },
    initGrid(): void {
      const grid = this.$refs.grid as HTMLDivElement;
      const width = grid.clientWidth;
      const height = grid.clientHeight;

      const rows = Math.floor(height / 25);
      const columns = Math.floor(width / 25);

      const newGrid = [];
      for (let i = 0; i < rows; i++) {
        const arr = [];

        for (let j = 0; j < columns; j++) {
          arr.push(this.createNode(i, j));
        }

        newGrid.push(arr);
      }

      this.grid = newGrid;
    },
    onResize(): void {
      const grid = this.$refs.grid as HTMLDivElement;
      const width = grid.clientWidth;
      // const height = grid.clientHeight;

      // const newRows = Math.floor(height / 25);
      const newCols = Math.floor(width / 25);

      // change on width
      const oldCols = this.grid.length > 0 ? this.grid[0].length : 0;
      if (newCols > oldCols) {
        for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < newCols - oldCols; col++) {
            this.grid[row].push(this.createNode(row, col));
          }
        }
      } else if (newCols < oldCols) {
        for (let row = 0; row < this.grid.length; row++) {
          this.grid[row] = this.grid[row].splice(0, newCols);
        }
      }
    },
    createNode(row: number, col: number): INode {
      return {
        row,
        col,
        isWall: false,
        isStart: false,
        isGoal: false,
        isVisited: false,
        g: Infinity,
        h: 0,
        f: 0,
      };
    },
    toggleWall(pos: Position, toggle: boolean) {
      const { row, col } = pos;
      if (!this.isDragging && row >= 0 && col >= 0) {
        this.grid[row][col].isWall = toggle;
      }
    },
    handleCapture(pos: Position) {
      const { row, col } = pos;
      const { row: sRow, col: sCol } = this.startNode;
      const { row: gRow, col: gCol } = this.goalNode;

      if (row === sRow && col === sCol) {
        this.isDragging = true;
        this.startNodeTemp = this.startNode;
      } else if (row === gRow && col === gCol) {
        this.isDragging = true;
        this.goalNodeTemp = this.goalNode;
      }
    },
    handleRelease(pos: Position) {
      if (!this.isDragging) return;

      this.isDragging = false;

      const newNode = this.grid[pos.row][pos.col];
      newNode.isWall = false;

      if (this.startNodeTemp) {
        this.startNode = newNode;
        this.startNodeTemp = undefined;
      } else if (this.goalNodeTemp) {
        this.goalNode = newNode;
        this.goalNodeTemp = undefined;
      }
    },
    handleNodeMove(pos: Position) {
      if (!this.isDragging) return;

      if (this.startNodeTemp) {
        this.startNodeTemp.isStart = false;
        this.startNodeTemp = this.grid[pos.row][pos.col];
        this.startNodeTemp.isStart = true;
      } else if (this.goalNodeTemp) {
        this.goalNodeTemp.isGoal = false;
        this.goalNodeTemp = this.grid[pos.row][pos.col];
        this.goalNodeTemp.isGoal = true;
      }
    },
    clearVisualize() {
      for (let row = 0; row < this.grid.length; row++)
        for (let col = 0; col < this.grid[row].length; col++)
          this.grid[row][col].g = Infinity;

      const elsVisited = document.getElementsByClassName('isVisited');
      const elsPath = document.getElementsByClassName('isPath');

      while (elsVisited.length > 0) {
        const item = elsVisited.item(0);
        if (item) item.classList.remove('isVisited');
      }

      while (elsPath.length > 0) {
        const item = elsPath.item(0);
        if (item) item.classList.remove('isPath');
      }
    },
    visualize(search: INode[], path: INode[]): void {
      // TODO: find an alternative to timeout
      let steps = 0;
      search.forEach((step) => {
        setTimeout(() => {
          const el = document.getElementById(`row-${step.row}-${step.col}`);

          if (el) {
            el.children[0].classList.add('isVisited');
          }
        }, steps * 15);

        steps += 1;
      });

      setTimeout(() => {
        path.forEach((step) => {
          const el = document.getElementById(`row-${step.row}-${step.col}`);

          if (el) {
            el.children[0].classList.remove('isVisited');
            el.children[0].classList.add('isPath');
          }
        });
      }, (steps + 1) * 15);
    },
  },
  computed: {},
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.reset();
    this.generateMaze();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
});
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  height: 100%;
  padding: 5px;
  // margin: 5px;
}

.grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px black solid;
}

.row {
  width: 100%;
  height: 100%;
  display: flex;

  & > div {
    flex-grow: 1;
  }

  :deep() .node:last-child .cell {
    border-right: 0;
  }

  :deep() &:last-child .cell {
    border-bottom: 0;
  }
}
</style>
