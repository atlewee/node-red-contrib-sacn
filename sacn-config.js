const e131 = require('e131')

module.exports = function(RED) {
    function sACNConfigNode(n) {
        RED.nodes.createNode(this,n);
        var node = this
        node.host = n.host;
        node.port = n.port;

        node.flowContext = node.context().global
        node.client = new e131.Client(node.host,[node.port])
        node.packet = node.flowContext.get("packet") || []

        node.set = function (universe, address, value) {
            if (!node.packet[universe]) {
                node.error("packet for universe does not exist: " + universe)
                node.packet[universe] = node.client.createPacket(512)
                node.packet[universe].setUniverse(universe)
            }
            if (address > 0) {
                let slotsData = node.packet[universe].getSlotsData()
                slotsData[address - 1] = value
                node.packet[universe].setSlotsData(slotsData)
                }
            }
        
        node.sendPacket = function (universe) {
            node.error(universe)
            node.client.send(node.packet[universe])
        }
        
        node.setChannelValue = function (universe, channel, value) {
            node.set(universe, channel, value)
            node.sendPacket(universe)
        }
        
        node.savePacketToContext = function () {
            node.flowContext.set("packet", node.packet)
        }
        
        node.on("close", function () {
            node.savePacketToContext()
            node.client = null
        })
    }
    RED.nodes.registerType("sacn-config",sACNConfigNode);
}