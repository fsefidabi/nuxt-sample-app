<template>
  <div class="flex w-screen">
    <div ref='diagramEl' class="w-full h-screen" style='background-color: #faf9fe'></div>
    <div ref='paletteEl' class="w-2/6 h-screen" style='background-color: #faf9fe; border: 1px solid #ddd'></div>
  </div>
</template>

<script>
  import go from 'gojs'
  import {onMounted, ssrRef, shallowSsrRef} from '@nuxtjs/composition-api'

  export default {
    name: 'GoJs',
    props: ['modelData'],
    setup (props, {emit}) {
      const $ = go.GraphObject.make
      let diagramEl = shallowSsrRef({v: 'init'})
      let paletteEl = shallowSsrRef({v: 'init'})
      let goJsDiagram = ssrRef(null)
      onMounted(() => {
        const palette = $(go.Palette, paletteEl.value)
        palette.nodeTemplate =
          $(go.Node, "Horizontal",
            $(go.Shape,
              { width: 14, height: 14, fill: "white" },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              new go.Binding("text", "color"))
          );
        palette.model.nodeDataArray = [
          { key: "C", color: "cyan" },
          { key: "LC", color: "lightcyan" },
          { key: "A", color: "aquamarine" },
          { key: "T", color: "turquoise" },
          { key: "PB", color: "powderblue" },
          { key: "LB", color: "lightblue" },
          { key: "LSB", color: "lightskyblue" },
          { key: "DSB", color: "deepskyblue" }
        ];


        const diagram = $(go.Diagram, diagramEl.value, {
          layout: $(go.TreeLayout, {angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal}),
          'undoManager.isEnabled': true,
          // Model ChangedEvents get passed up to component users
          'ModelChanged': function (e) { emit('model-changed', e) },
          'ChangedSelection': function (e) { emit('changed-selection', e) }
        })

        diagram.grid =
          $(go.Panel, go.Panel.Grid,  // or 'Grid'
            { gridCellSize: new go.Size(25, 25) },
            $(go.Shape, 'LineH', { stroke: '#eeeefe' }),
            $(go.Shape, 'LineV', { stroke: '#eeeefe' })
          );

        diagram.grid.visible = true
        diagram.grid.gridCellSize = new go.Size(50, 50)
        diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(20, 20)
        diagram.toolManager.draggingTool.isGridSnapEnabled = true
        diagram.toolManager.resizingTool.isGridSnapEnabled = true

        diagram.nodeTemplate = $(go.Node, 'Auto',
          $(go.Shape, {
              fill: 'white', strokeWidth: 0,
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            new go.Binding('fill', 'color')
          ),
          $(go.TextBlock,
            { margin: 8, editable: true },
            new go.Binding('text').makeTwoWay()
          )
        )

        diagram.linkTemplate =
          $(go.Link,
            {relinkableFrom: true, relinkableTo: true},
            $(go.Shape),
            $(go.Shape, {toArrow: 'OpenTriangle'})
          )

        goJsDiagram = diagram
        updateModel(props.modelData)
        console.log(diagram.model)
        console.log(goJsDiagram.model)
      })

      const model = function () {
        console.log(goJsDiagram.model)
        return goJsDiagram.model
      }

      const updateModel = function(val) {
        // No GoJS transaction permitted when replacing Diagram.model.
        if (val instanceof go.Model) {
          goJsDiagram.model = val
        } else {
          const m = new go.GraphLinksModel()
          if (val) {
            for (let p in val) {
              m[p] = val[p];
            }
          }
          goJsDiagram.model = m;
        }
      }

      const updateDiagramFromData = function() {
        goJsDiagram.startTransaction();
        // This is very general but very inefficient.
        // It would be better to modify the goJsDiagramData data by calling
        // Model.setDataProperty or Model.addNodeData, et al.
        goJsDiagram.updateAllRelationshipsFromData();
        goJsDiagram.updateAllTargetBindings();
        goJsDiagram.commitTransaction('updated');
      }

      return {
        $,
        diagramEl,
        paletteEl,
        goJsDiagram,
        model,
        updateModel,
        updateDiagramFromData
      }
    }
  }
</script>

<style scoped>
  .gojs-diagram {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
