const e131 = require('e131')

module.exports = function (RED) {
    function sACNConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this
        node.hostOrUniverse = n.hostOrUniverse;
        node.port = n.port;
        node.flowContext = node.context().global
        var hostOrUniverseHex =
            Number.isInteger(Number(node.hostOrUniverse))
                ? Number(node.hostOrUniverse)
                : node.hostOrUniverse
        node.client = new e131.Client(hostOrUniverseHex, node.port)

        node.packet = node.flowContext.get("packet") || []

        node.getUniverse = function (universe) {
            if (!node.packet[universe]) {
                node.packet[universe] = node.client.createPacket(512)
                node.packet[universe].setUniverse(universe)
            }
            return node.packet[universe].getSlotsData()
        }

        node.getChannel = function (universe, channel) {
            return node.getUniverse(universe)[channel - 1]
        }

        node.setChannel = function (universe, channel, value) {
            var slotsData = node.getUniverse(universe)
            slotsData[channel - 1] = value
            node.packet[universe].setSlotsData(slotsData)
        }

        node.setChannels = function (universe, channel, values) {
            var slotsData = node.getUniverse(universe)
            for (i = 0; i < values.length; i++) {
                slotsData[channel - 1 + i] = values[i]
            }
            node.packet[universe].setSlotsData(slotsData)
        }

        node.sendPacket = function (universe) {
            node.client.send(node.packet[universe])
        }

        node.transition = function (universe, channel, currentValue, targetValue, delay) {
            if (currentValue >= 0
                && currentValue <= 255
                && targetValue >= 0
                && targetValue <= 255
                && currentValue != targetValue
            ) {
                var newValue = currentValue < targetValue
                    ? currentValue + 1
                    : currentValue - 1
                node.setChannel(universe, channel, newValue)
                node.sendPacket(universe)
                setTimeout(function () { node.transition(universe, channel, newValue, targetValue, delay) }, delay)
            }
        }

        node.set = function (universe, channel, value, transition) {
            if (transition[0] == "rate" || transition[0] == "time") {
                var oldValue = node.getChannel(universe, channel)
                if (oldValue == value) { return; }
                if (transition[0] == "rate") {
                    node.transition(universe, channel, oldValue, value, transition[1])
                } else {
                    var steps = oldValue < value
                        ? value - oldValue
                        : oldValue - value
                    var delay = Math.round(transition[1] / steps)
                    node.transition(universe, channel, oldValue, value, delay)
                }
            } else {
                node.setChannel(parseInt(universe), parseInt(channel), parseInt(value))
                node.sendPacket(parseInt(universe))
            }
        }

        node.setArray = function (universe, channel, values) {
            node.setChannels(parseInt(universe), parseInt(channel), values)
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
    RED.nodes.registerType("sacn-config", sACNConfigNode);
}
