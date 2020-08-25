module.exports = function (RED) {
    function sACN(config) {
        RED.nodes.createNode(this, config)
        var node = this
        node.server = RED.nodes.getNode(config.server)

        node.on("input", function (msg) {
            if (node.server) {
                var topic = msg.topic ? msg.topic.split("/", 2) : ""
                var payload = {}

                payload.universe = msg.payload.universe || config.universe || parseInt(topic[0]) || 0
                if (config.universe && !topic[1]) {
                    payload.channel = msg.payload.channel || config.channel || parseInt(topic[0]) || 0
                } else {
                    payload.channel = msg.payload.channel || config.channel || parseInt(topic[1]) || 0
                }

                payload.transition = msg.payload.transition || config.transition || "instant"
                if (payload.transition === "instant") {
                    payload.transition = ["instant", 0]
                } else if (payload.transition === "rate") {
                    var rate = msg.payload.transitionRate || config.transitionRate || 50
                    payload.transition = ["rate", rate]
                } else {
                    var time = msg.payload.transitionTime || config.transitionTime || 1000
                    payload.transition = ["time", time]
                }
                if (Array.isArray(msg.payload)) {
                    node.server.setArray(payload.universe, msg.payload)
                } else {
                    var value = parseInt(msg.payload.value) || parseInt(msg.payload) || 0
                    node.server.set(payload.universe, payload.channel, value, payload.transition)
                }
            }
        })
    }
    RED.nodes.registerType("sACN", sACN)
}