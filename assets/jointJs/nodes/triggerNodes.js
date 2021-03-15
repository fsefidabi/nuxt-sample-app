import * as joint from 'jointjs'

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
      fill: '#ffa333'
    },
    label: {
      text: 'Time Trigger',
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

export {smartSegmentTrigger, listTrigger, timeTrigger}
