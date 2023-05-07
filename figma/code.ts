/// <reference types="@figma/plugin-typings" />
import handleDateTimeTab from './date-time'
import handleNumericTab from './numeric'

enum TabHeight {
  numeric = 220,
  dateTime = 550
}

figma.showUI(__html__, {
  width: 350,
  height: TabHeight.numeric
})

figma.ui.onmessage = payload => {
  // TODO: should separate tabChange and others
  if (payload.action === 'tabChange') {
    const height = TabHeight[payload.tab] as unknown as number
    figma.ui.resize(350, height)
  } else {
    const tabHandlers = {
      numeric: handleNumericTab,
      dateTime: handleDateTimeTab
    }
    const tabHandler = tabHandlers[payload.tab]
    if (tabHandler) {
      tabHandler(payload)
    }
  }
};