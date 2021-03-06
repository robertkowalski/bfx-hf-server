'use strict'

const validateParams = require('../../../util/ws/validate_params')
const send = require('../../../util/ws/send')

module.exports = async (server, ws, msg) => {
  const { exchangeClient } = server
  const [, exID, channelData] = msg

  const validRequest = validateParams(ws, {
    exID: { type: 'string', v: exID },
    channelData: { type: 'object', v: channelData }
  })

  if (!validRequest) {
    console.error('invalid request', msg)
    return
  }

  if (!ws.subscriptions) ws.subscriptions = {}
  if (!ws.subscriptions[exID]) ws.subscriptions[exID] = []

  ws.subscriptions[exID].push(channelData)

  const chanID = await exchangeClient.subscribe(channelData)
  send(ws, ['subscribed', exID, chanID, channelData])
}
