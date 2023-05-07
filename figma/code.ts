/// <reference types="@figma/plugin-typings" />
import handleDateTimeTab from './date-time'
import handleNumericTab from './numeric'

figma.showUI(__html__, {
  width: 350,
  height: 550
});



figma.ui.onmessage = payload => {
  const tabHandlers = {
    numeric: handleNumericTab,
    dateTime: handleDateTimeTab
  }
  const tabHandler = tabHandlers[payload.tab]
  if (tabHandler) {
    tabHandler(payload)
  }
};