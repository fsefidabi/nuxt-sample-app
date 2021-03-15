<template>
  <div class="w-screen h-screen flex main-container">
    <main class="w-full h-full">
      <div id="canvas" class="canvas"></div>
    </main>
    <aside class="w-1/3 h-screen bg-gray-200 py-3 px-5 overflow-y-scroll overflow-x-hidden">
      <div>
        <div class="font-bold text-sm">Triggers</div>
        <div class="palette pt-8 flex">
          <div v-for="(node, index) in nodes" :key="index" class="node w-1/3 flex flex-col items-center">
            <div class="chart-item flex justify-center items-center p-1 border-2 border-black"
                 :style="{backgroundColor: node.bgColor}">
              <img :src="node.image" class="w-11/12 h-11/12 object-cover" />
            </div>
            <div class="title text-xs text-center pt-2">{{ node.name }}</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
  import {onMounted} from '@nuxtjs/composition-api'
  import jsplumb from 'jsplumb'
  import $ from 'jquery'
  import 'jquery-ui/ui/widgets/draggable'
  import 'jquery-ui/ui/widgets/droppable'

  export default {
    name: 'jsplumb',
    setup () {
      const nodes = [
        {
          name: 'Smart Segment Trigger',
          image:
            'https://www.flaticon.com/svg/vstatic/svg/2361/2361939.svg?token=exp=1615564173~hmac=b1e6d2dc89e3efa02e8fdb143cf0c28a',
          bgColor: '#f34739'
        },
        {
          name: 'Time Trigger',
          image:
            'https://www.flaticon.com/svg/vstatic/svg/2088/2088617.svg?token=exp=1615564080~hmac=922b018ea248c77bb27b8b81f3ed9cd2',
          bgColor: '#faa33f'
        },
        {
          name: 'List Trigger',
          image:
            'https://www.flaticon.com/svg/vstatic/svg/507/507205.svg?token=exp=1615563824~hmac=81377172575db86e885c86657d075959',
          bgColor: '#6ee436'
        }
      ]

      onMounted(() => {
        const instance = jsPlumb.getInstance({
          // default drag options
          DragOptions: {cursor: 'pointer', zIndex: 2000, grid: [30, 30]},
          // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
          // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
          ConnectionOverlays: [
            ['Arrow', {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
              id: 'ARROW',
              events: {
                click: function () { console.log('you clicked on the arrow overlay')}
              }
            }],
            ['Label', {
              location: 0.1,
              id: 'label',
              cssClass: 'aLabel',
              events: {
                tap: function () { console.log('hey') }
              }
            }]
          ],
          Container: 'canvas'
        })
        const connectorPaintStyle = {
          strokeWidth: 2,
          stroke: '#61B7CF',
          joinstyle: 'round',
          outlineStroke: 'white',
          outlineWidth: 2
        }
        const connectorHoverStyle = {
          strokeWidth: 3,
          stroke: '#216477',
          outlineWidth: 5,
          outlineStroke: 'white'
        }
        const endpointHoverStyle = {
          fill: '#216477',
          stroke: '#216477'
        }
        const sourceEndpoint = {
          endpoint: 'Dot',
          paintStyle: {
            stroke: '#47b6a3',
            fill: 'transparent',
            radius: 15,
            strokeWidth: 2
          },
          isSource: true,
          connector: [
            'Flowchart',
            {
              stub: [40, 60],
              gap: 10,
              cornerRadius: 5,
              alwaysRespectStubs: true
            }
          ],
          connectorStyle: connectorPaintStyle,
          hoverPaintStyle: endpointHoverStyle,
          connectorHoverStyle: connectorHoverStyle,
          dragOptions: {},
          overlays: [
            [
              'Label',
              {
                location: [0.5, 1.5],
                label: 'Drag',
                cssClass: 'endpointSourceLabel',
                visible: false
              }
            ]
          ]
        }
        const targetEndpoint = {
          endpoint: 'Dot',
          paintStyle: {fill: '#47b6a3', radius: 15},
          hoverPaintStyle: endpointHoverStyle,
          maxConnections: -1,
          dropOptions: {hoverClass: 'hover', activeClass: 'active'},
          isTarget: true,
          overlays: [
            [
              'Label',
              {
                location: [0.5, -0.5],
                label: 'Drop',
                cssClass: 'endpointTargetLabel',
                visible: false
              }
            ]
          ]
        }

        const init = function (connection) {
          connection.getOverlay('label').setLabel('testing')
        }

        const addEndpoints = function (toId, sourceAnchors, targetAnchors) {
          for (let i = 0; i < sourceAnchors.length; i++) {
            const sourceUUID = toId + sourceAnchors[i]
            instance.addEndpoint(toId, sourceEndpoint, {
              anchor: sourceAnchors[i],
              uuid: sourceUUID
            })
          }
          for (let j = 0; j < targetAnchors.length; j++) {
            const targetUUID = toId + targetAnchors[j]
            instance.addEndpoint(toId, targetEndpoint, {
              anchor: targetAnchors[j],
              // anchor: 'Continuous',
              uuid: targetUUID
            })
          }
        }

        instance.batch(function () {
          // listen for new connections;
          instance.bind('connection', function (connInfo, originalEvent) {
            init(connInfo.connection)
          })
          // make all the window divs draggable
          instance.draggable(document.querySelectorAll('.chart-item'), {
            grid: [10, 50]
          })
          // listen for clicks on connections, and offer to delete connections on click.
          instance.bind('click', function (conn, originalEvent) {
            // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
            //   instance.detach(conn);
            // conn.toggleType("basic");
          })
          instance.bind('connectionDrag', function (connection) {
          })
          $('.palette .chart-item').draggable({
            scope: 'graph',
            helper: 'clone',
            containment: $('.main-container')
          })
          $('main').droppable({
            scope: 'graph',
            drop: function (ev, ui) {
              let id = 'item' + new Date().getTime()
              const nodeTitle = $(`#${ui.draggable[0].id}`).next()[0].innerHTML
              const droppedNode =
                `<div id="${id}" class="${ui.helper[0].classList.value} w-40 h-40 shadow-xl flex flex-col items-center justify-center text-center" style="position: absolute; top: ${ui.position.top}px; left: ${ui.position.left}px; background-color: ${ui.helper[0].style.backgroundColor}; border-radius: 50%; border: none">
                   <p class="w-2/3 text-sm pb-5">${nodeTitle}</p>
                   <img src="${ui.helper[0].children[0].currentSrc}" class="w-1/3 h-1/3">
                 </div>`
              $(this).append(droppedNode)
              $('#' + id).css({
                top: `${ui.position.top} px`,
                left: `${ui.position.left} px`
              })
              console.log(ev.target)
              addEndpoints(
                id,
                ['RightMiddle'],
                ['LeftMiddle']
              )
              instance.draggable(id)
            }
          })
        })
      })

      return {
        nodes
      }
    }
  }
</script>

<style scoped>
  .chart-item {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  main {
    background-size: 30px 30px;
    background-image: linear-gradient(to right, rgba(10, 10, 10, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(10, 10, 10, 0.3), transparent 1px)
  }
</style>
