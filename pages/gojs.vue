<template>
  <div class="h-screen flex justify-center items-center">
    <GoJsDiagram :model-data="diagramData"></GoJsDiagram>
  </div>
</template>

<script>
  import GoJsDiagram from '../components/GoJsDiagram'
  export default {
    name: 'gojs',
    components: { GoJsDiagram },
    setup () {
      const diagramData = { // passed to <diagram> as its modelData
        nodeDataArray: [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange" },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" }
        ],
        linkDataArray: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 3, to: 4 }
        ]
      }
      const currentNode = null
      const savedModelText = ""
      const counter = 1  // used by addNode
      const counter2 = 4  // used by modifyStuff

      return {
        diagramData,
        currentNode,
        savedModelText,
        counter,
        counter2
      }
    }
  }
</script>

<style scoped>

</style>
