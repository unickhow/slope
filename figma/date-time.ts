function addDays (date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDate(date: Date, format: string): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const weekday = date.getDay()
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // TODO: better way to handle this...
  const patterns = {
    'YYYY-MM-DD': `${year}-${(month).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    'YYYY/MM/DD': `${year}/${(month).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`,
    'MM-DD-YYYY': `${(month).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`,
    'MM/DD/YYYY': `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`,
    'MMMM DD, YYYY': `${months[date.getMonth()]} ${day}, ${year}`,
    'MMMM DD, YYYY h:mm A': `${months[date.getMonth()]} ${day}, ${year} ${date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`,
    'dddd, MMMM DD, YYYY h:mm A': `${days[weekday]}, ${months[date.getMonth()]} ${day}, ${year} ${date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`,
    'M/D/YYYY': `${month}/${day}/${year}`,
    'MMM D, YYYY': `${months[date.getMonth()].slice(0, 3)} ${day}, ${year}`,
    'MMM D, YYYY h:mm A': `${months[date.getMonth()].slice(0, 3)} ${day}, ${year} ${date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`,
    'ddd, MMM D, YYYY h:mm A': `${days[weekday].slice(0, 3)}, ${months[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`
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

export default async function handleDateTimeTab (payload) {
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