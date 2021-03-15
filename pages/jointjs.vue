<template>
  <div class="flex w-screen h-screen">
    <div id="mainCanvas" ref="mainCanvas"></div>
    <div class="w-1/3 h-screen bg-gray-200 py-3 px-5 overflow-y-scroll overflow-x-hidden">
      <div>
        <span class="font-bold text-sm">Triggers</span>
        <div id="triggersPalette" ref="triggersPalette"></div>
      </div>
      <div>
        <span class="font-bold text-sm">Actions</span>
        <div id="actionsPalette" ref="actionsPalette"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {onMounted, shallowSsrRef, ssrRef} from '@nuxtjs/composition-api'
  import * as joint from 'jointjs'
  import $ from 'jquery'
  import { smartSegmentTrigger, listTrigger, timeTrigger } from '../assets/jointJs/nodes/triggerNodes'
  import { addDelayAction } from '../assets/jointJs/nodes/actionNodes'

  export default {
    name: 'jointjs',
    setup () {
      const flyPaperVisible = ssrRef(false)
      const canvasGraph = new joint.dia.Graph
      const triggersGraph = new joint.dia.Graph
      const actionsGraph = new joint.dia.Graph
      const conditionsGraph = new joint.dia.Graph
      const flyPaperGraph = new joint.dia.Graph
      const mainCanvas = shallowSsrRef({v: 'init'})
      const triggersPalette = shallowSsrRef({v: 'init'})
      const actionsPalette = shallowSsrRef({v: 'init'})
      const conditionsPalette = shallowSsrRef({v: 'init'})
      const flyPaper = shallowSsrRef({v: 'init'})
      onMounted(() => {
        // Canvas where shapes are dropped
        const jointjsCanvas = new joint.dia.Paper({
          el: mainCanvas.value,
          model: canvasGraph,
          width: '100%',
          height: '100%',
          gridSize: 10,
          drawGrid: true
        })

        // Palette from which you take shapes
        const jointjsTriggersPalette = new joint.dia.Paper({
          el: triggersPalette.value,
          model: triggersGraph,
          width: '100%',
          height: 200,
          interactive: false
        })
        triggersGraph.addCells([smartSegmentTrigger, listTrigger, timeTrigger])
        jointjsTriggersPalette.on('cell:pointerdown', async function (cellView, e, x, y) {
          $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>')
          const jointjsFlyPaper = new joint.dia.Paper({
            el: $('#flyPaper'),
            model: flyPaperGraph,
            width: '100%',
            height: '100%',
            interactive: false
          })
          const flyShape = cellView.model.clone()
          const pos = cellView.model.position()
          const offset = {
            x: x - pos.x,
            y: y - pos.y
          }
          flyShape.position(0, 0)
          flyPaperGraph.addCell(flyShape)
          $('#flyPaper').offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
          })

          $('body').on('mousemove.fly', function (e) {
            $('#flyPaper').offset({
              left: e.pageX - offset.x,
              top: e.pageY - offset.y
            })
          })
          $('body').on('mouseup.fly', function (e) {
            const x = e.pageX
            const y = e.pageY
            const target = jointjsCanvas.$el.offset()

            // Dropped over paper ?
            if (x > target.left && x < target.left + jointjsCanvas.$el.width() && y > target.top && y < target.top +
              jointjsCanvas.$el.height()) {
              const s = flyShape.clone()
              console.log(s)
              joint.shapes.devs.ChabokTriggerNode = joint.shapes.devs.Model.extend({
                markup:
                  '<g class="rotatable shadow-sm"><g class="scalable"><circle class="body"/></g><image/><text class="label"/><g class="outPorts"/></g>',
                defaults: joint.util.deepSupplement({
                  type: 'devs.TriggerNode',
                  size: {
                    width: 80,
                    height: 80
                  },
                  attrs: {
                    '.body': {
                      stroke: '#000',
                      filter: {
                        name: 'dropShadow',
                        args: {
                          dx: 0,
                          dy: 0,
                          blur: 10,
                          color: '#ddd'
                        }
                      }
                    },
                    circle: {
                      r: 70,
                      stroke: '#000',
                      fill: s.attributes.attrs.background.fill
                    },
                    '.label': {
                      text: s.attributes.attrs.label.text.replace('\n', ""),
                      lineHeight: 20,
                      'ref-y': -20,
                      'font-size': 15,
                      transform: 'matrix(1,0,0,1,-80,-25)'
                    },
                    '.outPorts circle': {
                      fill: '#262626'
                    },
                    '.joint-port': {
                      transform: 'matrix(1,0,0,1,5,0)'
                    },
                    image: {
                      'xlink:href': s.attributes.attrs.image.xlinkHref,
                      width: 80,
                      height: 50,
                      'ref-x': .5,
                      'ref-y': .5,
                      ref: 'circle',
                      'x-alignment': 'middle',
                      'y-alignment': 'top'
                    }
                  }

                }, joint.shapes.devs.Model.prototype.defaults)
              })
              joint.shapes.devs.ChabokTriggerNodeView = joint.shapes.devs.ModelView

              const triggerNode = new joint.shapes.devs.ChabokTriggerNode({
                position: {
                  x: x - target.left - offset.x,
                  y: y - target.top - offset.y
                },
                size: {
                  width: 160,
                  height: 160
                },
                outPorts: [''],
                ports: {
                  groups: {
                    'out': {
                      attrs: {
                        '.port-body': {
                          r: 15,
                          fill: '#47b6a3',
                          stroke: '#fff',
                          transform: 'matrix(1,0,0,1,-78,-78)'
                        }
                      }
                    }
                  }
                }
              })
              canvasGraph.addCell(triggerNode)
              const removeButton = new joint.elementTools.Remove({
                useModelGeometry: true,
                y: '-35%',
                x: '-35%'
              })
              showRemoveButton(removeButton, triggerNode, jointjsCanvas)
            }
            $('body').off('mousemove.fly').off('mouseup.fly')
            flyShape.remove()
            $('#flyPaper').remove()
          })
        })

        const jointjsActionsPalette = new joint.dia.Paper({
          el: actionsPalette.value,
          model: actionsGraph,
          width: '100%',
          height: 200,
          interactive: false
        })
        actionsGraph.addCells([addDelayAction])
        jointjsActionsPalette.on('cell:pointerdown', async function (cellView, e, x, y) {
          $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>')
          const jointjsFlyPaper = new joint.dia.Paper({
            el: $('#flyPaper'),
            model: flyPaperGraph,
            width: '100%',
            height: '100%',
            interactive: false
          })
          const flyShape = cellView.model.clone()
          const pos = cellView.model.position()
          const offset = {
            x: x - pos.x,
            y: y - pos.y
          }
          flyShape.position(0, 0)
          flyPaperGraph.addCell(flyShape)
          $('#flyPaper').offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
          })
          $('body').on('mousemove.fly', function (e) {
            $('#flyPaper').offset({
              left: e.pageX - offset.x,
              top: e.pageY - offset.y
            })
          })
          $('body').on('mouseup.fly', function (e) {
            const x = e.pageX,
              y = e.pageY,
              target = jointjsCanvas.$el.offset()

            // Dropped over paper ?
            if (x > target.left && x < target.left + jointjsCanvas.$el.width() && y > target.top && y < target.top +
              jointjsCanvas.$el.height()) {
              const s = flyShape.clone()
              joint.shapes.devs.ChabokActionNode = joint.shapes.devs.Model.extend({
                markup:
                  '<g class="rotatable shadow-sm"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="outPorts"/></g>',
                defaults: joint.util.deepSupplement({
                  type: 'devs.ActionNode',
                  size: {
                    width: 80,
                    height: 80
                  },
                  attrs: {
                    '.body': {
                      stroke: '#000',
                      filter: {
                        name: 'dropShadow',
                        args: {
                          dx: 0,
                          dy: 0,
                          blur: 10,
                          color: '#ddd'
                        }
                      }
                    },
                    rect: {
                      r: 70,
                      stroke: '#000',
                      fill: s.attributes.attrs.background.fill
                    },
                    '.label': {
                      text: s.attributes.attrs.label.text.replace('\n', ""),
                      lineHeight: 20,
                      'ref-y': -20,
                      'font-size': 15,
                      transform: 'matrix(1,0,0,1,0,55)'
                    },
                    '.outPorts circle': {
                      fill: '#262626'
                    },
                    '.joint-port': {
                      transform: 'matrix(1,0,0,1,5,0)'
                    },
                    image: {
                      'xlink:href': s.attributes.attrs.image.xlinkHref,
                      width: 60,
                      height: 40,
                      'ref-x': .5,
                      'ref-y': .5,
                      ref: 'rect',
                      'x-alignment': 'middle',
                      'y-alignment': 'top'
                    }
                  }
                }, joint.shapes.devs.Model.prototype.defaults)
              })
              joint.shapes.devs.ChabokTriggerNodeView = joint.shapes.devs.ModelView

              const ActionNode = new joint.shapes.devs.ChabokActionNode({
                position: {
                  x: x - target.left - offset.x,
                  y: y - target.top - offset.y
                },
                size: {
                  width: 140,
                  height: 140
                },
                inPorts: [''],
                outPorts: [' '],
                ports: {
                  groups: {
                    'in': {
                      attrs: {
                        '.port-body': {
                          r: 15,
                          fill: '#47b6a3',
                          stroke: '#fff',
                         }
                      }
                    },
                    'out': {
                      attrs: {
                        '.port-body': {
                          r: 15,
                          fill: '#47b6a3',
                          stroke: '#fff',
                        }
                      }
                    }
                  }
                }
              })
              ActionNode.position(x - target.left - offset.x, y - target.top - offset.y)
              canvasGraph.addCell(ActionNode)
              const removeButton = new joint.elementTools.Remove({
                useModelGeometry: true
              })
              showRemoveButton(removeButton, ActionNode, jointjsCanvas)
            }
            $('body').off('mousemove.fly').off('mouseup.fly')
            flyShape.remove()
            $('#flyPaper').remove()
          })
        })

        jointjsCanvas.on('element:mouseenter', function (elementView) {
          elementView.model.attr('circle/stroke', '#87888a')
          elementView.model.attr('rect/stroke', '#87888a')
          elementView.model.attr('circle/stroke-width', '3')
          elementView.model.attr('rect/stroke-width', '3')
          // console.log(elementView.model.attributes)
          })
        jointjsCanvas.on('element:mouseleave', function (elementView) {
          elementView.model.attr('circle/stroke-width', '3')
          elementView.model.attr('rect/stroke-width', '3')
          elementView.model.attr('circle/stroke', elementView.model.attributes.attrs.circle.fill)
          elementView.model.attr('rect/stroke', elementView.model.attributes.attrs.rect.fill)
        })
      })

      const showRemoveButton = function (removeButton, node, jointjsPaper) {
        const toolsView = new joint.dia.ToolsView({
          name: 'basic-tools',
          tools: [removeButton]
        })
        const elementView = node.findView(jointjsPaper)
        elementView.addTools(toolsView)
        elementView.hideTools()
        jointjsPaper.on('element:mouseenter', function (elementView) {
          elementView.showTools()
        })
        jointjsPaper.on('element:mouseleave', function (elementView) {
          elementView.hideTools()
        })
      }

      return {
        flyPaperVisible,
        mainCanvas,
        flyPaper,
        canvasGraph,
        triggersGraph,
        actionsGraph,
        conditionsGraph,
        flyPaperGraph,
        triggersPalette,
        actionsPalette,
        conditionsPalette,
        showRemoveButton
      }
    }
  }
</script>

<style scoped>

</style>
