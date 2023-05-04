/// <reference types="@figma/plugin-typings" />
figma.showUI(__html__, {
  width: 400,
  height: 550
});

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

async function handleNumericTab (payload) {
  const { prefix, baseNumber, orderType, action, isReverse } = payload
  const nodes = figma.currentPage.selection
  const nodesLength = nodes.length
  if (action === 'generate') {
    const isInvalid = nodes.some(node => node.type !== 'TEXT');
    if (isInvalid) {
      return "Select a single text node."
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

function addDays (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDate(date: Date, format: string): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const patterns = {
    'YYYY-MM-DD': `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    'MM-DD-YYYY': `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`,
    'MM/DD/YYYY': `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`,
    'MMMM DD, YYYY': `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    'MMMM DD, YYYY h:mm A': `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${hours % 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
    'dddd, MMMM DD, YYYY h:mm A': `${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} ${hours % 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
    'M/D/YYYY': `${month}/${day}/${year}`,
    'MMM D, YYYY': `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    'MMM D, YYYY h:mm A': `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${hours % 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
    'ddd, MMM D, YYYY h:mm A': `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} ${hours % 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
  }

  if (patterns[format]) {
    return patterns[format]
  } else {
    throw new Error(`Unsupported format: ${format}`)
  }
}

function setBaseDate (base = '', orderType = 'asc', format) {
  const baseDate = new Date(base)
  let stack = 0
  let res
  return () => {
    if (orderType === 'asc') {
      res = addDays(baseDate, stack)
    } else if (orderType === 'desc') {
      res = addDays(baseDate, -stack)
    }
    stack += 1
    return formatDate(res, format)
  }
}

async function handleDatetimeTab (payload) {
  const {
    action,
    orderType,
    selectedDate,
    format
  } = payload
  const nodes = figma.currentPage.selection
  const nodesLength = nodes.length
  if (action === 'generate') {
    const isInvalid = nodes.some(node => node.type !== 'TEXT');
    if (isInvalid) {
      return "Select a single text node."
    }

    const genNextDate = setBaseDate(selectedDate, orderType, format)

    for (let i = 0; i < nodesLength; i += 1) {
      //! Noted: order of page selections are not reliable.
      await figma.loadFontAsync(nodes[i].fontName)
      nodes[i].characters = genNextDate()
    }
  }

  // on cancel
  if (action === 'cancel') {
    figma.closePlugin();
  }
}

figma.ui.onmessage = payload => {
  const tabHandlers = {
    numeric: handleNumericTab,
    datetime: handleDatetimeTab
  }
  const tabHandler = tabHandlers[payload.tab]
  if (tabHandler) {
    tabHandler(payload)
  }
};