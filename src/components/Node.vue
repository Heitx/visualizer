<template>
  <div
    :id="`row-${row}-${col}`"
    class="node"
    @mouseup.prevent="handleMouseUp"
    @mousedown.prevent="handleMouseDown"
    @mouseenter.prevent="handleMouseEnter"
  >
    <div :class="classes"></div>
  </div>
</template>

<script lang="ts">
//
import Position from '@/types/position';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Node',
  props: {
    row: {
      type: Number,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    isWall: {
      type: Boolean,
      required: true,
      default: false,
    },
    isStart: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGoal: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    getPosition(): Position {
      return {
        row: this.row,
        col: this.col,
      };
    },
    handleMouseUp() {
      if (this.isStart || this.isGoal) {
        this.$emit('node:release', this.getPosition());
      }
    },
    handleMouseDown(event: MouseEvent) {
      if (this.isStart || this.isGoal) {
        this.$emit('node:capture', this.getPosition());
      } else if (!this.isWall && event.buttons === 1) {
        this.$emit('wall:on', this.getPosition());
      } else if (this.isWall && event.buttons === 2) {
        this.$emit('wall:off', this.getPosition());
      }
    },
    handleMouseEnter(event: MouseEvent) {
      this.$emit('node:move', this.getPosition());

      if (this.isStart || this.isGoal) return;

      if (!this.isWall && event.buttons === 1) {
        this.$emit('wall:on', this.getPosition());
      } else if (this.isWall && event.buttons === 2) {
        this.$emit('wall:off', this.getPosition());
      }
    },
  },
  computed: {
    classes(): Record<string, unknown> {
      return {
        cell: true,
        isWall: this.isWall,
        isStart: this.isStart,
        isGoal: this.isGoal,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.node {
  display: flex;
  flex: 1;

  .cell {
    width: 100%;
    height: 100%;
    border-right: 1px rgb(85, 85, 85) solid;
    border-bottom: 1px rgb(85, 85, 85) solid;

    &:hover.isWall {
      background-color: lightskyblue;
    }
  }
}

.isWall {
  background-color: gray;
  // animation: scaleup 0.2s;
}

.isStart {
  background-color: #8ad42b;
}

.isGoal {
  background-color: #bb1e28;
}

.isVisited {
  background-color: #752bd4;
}

.isPath {
  background-color: #2bd4ca;
}

// makes wall building slower (gaps appearing)
@keyframes scaleup {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
