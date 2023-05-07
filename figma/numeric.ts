function setBaseNumber (base = '0', orderType = 'asc', length) {
  const baseNumber = +base
  let stack = 0
  let res
  return () => {
    if (orderType === 'asc') {
      res = baseNumber + stack
    } else if (orderType === 'desc') {
      res = baseNumber - stack
    } else {
      res = Math.floor(Math.random() * Math.pow(10, length))
    }
    stack += 1
    return res.toString().padStart(length, '0')
  }
}

export default async function handleNumericTab (payload) {
  const { prefix, baseNumber, orderType, action, isReverse } = payload
  const nodes = figma.currentPage.selection
  const nodesLength = nodes.length
  if (action === 'generate') {
    const isInvalid = nodes.some(node => node.type !== 'TEXT');
    if (isInvalid) {
      return 'Select a single text node.'
    }

    const genNextNumber = setBaseNumber(baseNumber, orderType, baseNumber.length)

    for (let i = 0; i < nodesLength; i += 1) {
      //! Noted: order of page selections are not reliable.
      await figma.loadFontAsync(nodes[i].fontName)
      const result = isReverse
        ? `${genNextNumber()}${prefix}`
        : `${prefix}${genNextNumber()}`
      nodes[i].characters = result
      nodes[i].name = result
    }
  }

  // on cancel
  if (action === 'cancel') {
    figma.closePlugin();
  }
}