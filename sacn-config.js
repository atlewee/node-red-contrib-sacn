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

        node.set = function (universe, channel, value) {
            if (!node.packet[universe]) {
                node.packet[universe] = node.client.createPacket(512)
                node.packet[universe].setUniverse(universe)
            }
            if (channel > 0) {
                let slotsData = node.packet[universe].getSlotsData()
                slotsData[channel - 1] = value
                node.packet[universe].setSlotsData(slotsData)
                }
            }
        
        node.sendPacket = function (universe) {
            node.client.send(node.packet[universe])
        }

        node.setWithArray = function (universe, offset, data) {
            for (i=0; i < data.length; i++) {
                node.set(parseInt(universe), parseInt(offset)+i, data[i])
            }
            node.sendPacket(parseInt(universe))
        }

        node.setWithBuckets = function (universe, buckets) {
            for (i=0; i < buckets.length; i++) {
                node.set(parseInt(universe, buckets[i].channel, buckets[i].value))
            }
            node.sendPacket(parseInt(universe))
        }
        
        node.setChannelValue = function (universe, channel, value) {
            node.set(parseInt(universe), parseInt(channel), parseInt(value))
            node.sendPacket(parseInt(universe))
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