<template>
  <div class="flex w-screen h-screen">
    <div id="mainCanvas" ref="mainCanvas"></div>
    <div class="w-1/3 bg-gray-200 py-3 px-5">
      <div>
        <span class="font-bold text-sm">Triggers</span>
        <div id="triggersPalette" ref="triggersPalette"></div>
      </div>
      <div>
        <span class="font-bold text-sm">Actions</span>
        <div id="actionsPalette" ref="actionsPalette"></div>
      </div>
    </div>
    <!--        <div id="flyPaper"-->
    <!--             ref="flyPaper"-->
    <!--             style="position:fixed; z-index:100; opacity:0.7; pointer-event:none;">-->
    <!--        </div>-->
  </div>
</template>

<script>
  import {onMounted, shallowSsrRef, ssrRef} from '@nuxtjs/composition-api'
  import * as joint from 'jointjs'
  import $ from 'jquery'

  export default {
    name: 'jointjs',
    setup () {
      const flyPaperVisible = ssrRef(false)
      const canvasGraph = new joint.dia.Graph
      const triggersGraph = new joint.dia.Graph
      const actionsGraph = new joint.dia.Graph
      const flyPaperGraph = new joint.dia.Graph
      const mainCanvas = shallowSsrRef({v: 'init'})
      const triggersPalette = shallowSsrRef({v: 'init'})
      const actionsPalette = shallowSsrRef({v: 'init'})
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

        jointjsCanvas.setGrid('doubleMesh').drawGrid()

        // Palette from which you take shapes
        const jointjsTriggersPalette = new joint.dia.Paper({
          el: triggersPalette.value,
          model: triggersGraph,
          width: '100%',
          height: 200,
          interactive: false
        })
        const smartSegmentTrigger = new joint.shapes.standard.InscribedImage({
          position: {
            x: 25,
            y: 30
          },
          size: {
            width: 50,
            height: 50
          },
          attrs: {
            background: {
              fill: '#ff1e1e'
            },
            label: {
              text: 'Smart \nSegment \nTrigger',
              lineHeight: 15,
              fontSize: 12
            },
            image: {
              xlinkHref: 'https://www.flaticon.com/svg/vstatic/svg/2361/2361939.svg?token=exp=1615564173~hmac=b1e6d2dc89e3efa02e8fdb143cf0c28a'
            }
          }
        })
        const timeTrigger = new joint.shapes.standard.InscribedImage({
          position: {
            x: 125,
            y: 30
          },
          size: {
            width: 50,
            height: 50
          },
          attrs: {
            background: {
              fill: '#ffa333',
            },
            label: {
              text: 'List Trigger',
              fontSize: 12
            },
            image: {
              xlinkHref: 'https://www.flaticon.com/svg/vstatic/svg/2088/2088617.svg?token=exp=1615564080~hmac=922b018ea248c77bb27b8b81f3ed9cd2'
            }
          }
        })
        const listTrigger = new joint.shapes.standard.InscribedImage({
          position: {
            x: 235,
            y: 30
          },
          size: {
            width: 50,
            height: 50
          },
          attrs: {
            background: {
              fill: '#17e831'
            },
            label: {
              text: 'List Trigger',
              fontSize: 12
            },
            image: {
              xlinkHref: 'https://www.flaticon.com/svg/vstatic/svg/507/507205.svg?token=exp=1615563824~hmac=81377172575db86e885c86657d075959'
            }
          }
        })
        triggersGraph.addCells([smartSegmentTrigger, listTrigger, timeTrigger])

        const jointjsActionsPalette = new joint.dia.Paper({
          el: actionsPalette.value,
          model: actionsGraph,
          width: '100%',
          height: 200,
          interactive: false
        })
        const addDelayAction = new joint.shapes.standard.BorderedImage({
          position: {
            x: 25,
            y: 30
          },
          size: {
            width: 50,
            height: 50
          },
          attrs: {
            background: {
              fill: '#17e831',
            },
            label: {
              text: 'Add Delay',
              fontSize: 12
            },
            image: {
              xlinkHref:
                'https://www.flaticon.com/svg/vstatic/svg/0/838.svg?token=exp=1615565871~hmac=517ab49f85c321d0f66a2b3ded59b47e'
            }
          }
        })
        actionsGraph.addCells([addDelayAction])
        jointjsTriggersPalette.on('cell:pointerdown', async function (cellView, e, x, y) {
          visible()
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
              s.position(x - target.left - offset.x, y - target.top - offset.y)
              canvasGraph.addCell(s)
            }
            $('body').off('mousemove.fly').off('mouseup.fly')
            visible()
            flyShape.remove()
            $('#flyPaper').remove()
          })
        })

        jointjsActionsPalette.on('cell:pointerdown', async function (cellView, e, x, y) {
          visible()
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
              s.position(x - target.left - offset.x, y - target.top - offset.y)
              canvasGraph.addCell(s)
            }
            $('body').off('mousemove.fly').off('mouseup.fly')
            visible()
            flyShape.remove()
            $('#flyPaper').remove()
          })
        })
      })

      const visible = function () {
        flyPaperVisible.value = !flyPaperVisible.value
      }

      return {
        visible,
        flyPaperVisible,
        mainCanvas,
        flyPaper,
        canvasGraph,
        triggersGraph,
        actionsGraph,
        flyPaperGraph,
        triggersPalette,
        actionsPalette
      }
    }
  }
</script>

<style scoped>

</style>
