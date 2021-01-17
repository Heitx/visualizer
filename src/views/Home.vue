<template>
  <div class="home">
    <Toolbar
      @reset:all="onResetAll"
      @reset:walls="onResetWalls"
      @reset:visuals="onResetVisuals"
      @start:astar="onStartAstar"
      @start:dijkstra="OnStartDijkstra"
    />
    <Board ref="board" />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

import dijkstra from '@/algorithms/dijkstra';
import astar from '@/algorithms/astar';
import Board from '@/components/Board.vue';
import Toolbar from '@/components/Toolbar.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Board,
    Toolbar,
  },
  methods: {
    onResetAll() {
      const board = this.$refs.board as any;
      board.reset();
    },
    onResetWalls() {
      const board = this.$refs.board as any;
      board.resetWalls();
    },
    onResetVisuals() {
      const board = this.$refs.board as any;
      board.clearVisualize();
    },
    onStartAstar() {
      const board = this.$refs.board as any;

      board.clearVisualize();
      const result = astar(board.grid, board.startNode, board.goalNode);

      if (!result) return;

      board.visualize(result.search, result.path);
    },
    OnStartDijkstra() {
      const board = this.$refs.board as any;

      board.clearVisualize();
      const result = dijkstra(board.grid, board.startNode, board.goalNode);

      if (!result) return;

      board.visualize(result.search, result.path);
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.menu {
  display: flex;
}
</style>
