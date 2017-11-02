const e131 = require('e131')

module.exports = function (RED) {
    function sACN(config) {
        RED.nodes.createNode(this, config)
        
        var node = this
        node.flowContext = node.context().global

        node.name = config.name
        node.address = config.address
        node.size = config.size || 512
        node.universe = config.universe || 1


        node.client = new e131.Client(node.address)
        node.packet = node.flowContext.get("packet") || node.client.createPacket(node.size)
        node.packet.setUniverse(node.universe)

        node.set = function (address, value) {
            if (address > 0) {
                let slotsData = node.packet.getSlotsData()
                slotsData[address - 1] = value
                node.packet.setSlotsData(slotsData)
            }
        }

        node.sendPacket = function () {
            node.client.send(node.packet)
        }

        node.setChannelValue = function (channel, value) {
            node.set(channel, value)
            node.sendPacket()
        }

        node.savePacketToContext = function () {
            node.flowContext.set("packet", node.packet)
        }

        node.on("close", function () {
            node.savePacketToContext()
        })

        node.on("input", function (msg) {
            const payload = msg.payload
            if (payload.channel) {
                node.setChannelValue(payload.channel, payload.value)
            } else {
                node.error("Invalid payload: " + payload )
            }
        })
    }

    RED.nodes.registerType("sACN", sACN)
}