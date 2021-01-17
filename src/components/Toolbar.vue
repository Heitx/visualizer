<template>
  <div class="toolbar">
    <button @click="$emit('reset:all')">Reset All</button>
    <button @click="$emit('reset:walls')">Reset Walls</button>
    <button @click="$emit('reset:visuals')">Reset Visuals</button>
    <button @click="$emit('start:astar')">Start A*</button>
    <button @click="$emit('start:dijkstra')">Start Dijkstra</button>
    <button>...</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Toolbar',
  props: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toolbar {
  display: flex;
  gap: 5px;
  padding: 5px 5px 0 5px;

  button {
    box-shadow: inset 0px 34px 0px -15px #b54b3a;
    background-color: #a73f2d;
    border: 1px solid #241d13;
    border-radius: 0;
    display: inline-block;
    color: #ffffff;
    padding: 9px 23px;
    text-decoration: none;
    text-shadow: 0px -1px 0px #7a2a1d;
    outline: none;
  }

  button:active {
    position: relative;
    top: 1px;
  }
}
</style>
