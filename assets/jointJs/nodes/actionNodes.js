import * as joint from 'jointjs'

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
      fill: '#17e831'
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

export {addDelayAction}

