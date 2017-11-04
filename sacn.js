module.exports = function (RED) {
    function sACN(config) {
        RED.nodes.createNode(this, config)
        let node = this
        node.server = RED.nodes.getNode(config.server)

        node.on("input", function (msg) {
            if(node.server) {
                let topic = msg.topic.split("/",2)
                let payload = {}
                
                payload.universe = msg.payload.universe || config.universe || parseInt(topic[0]) || 0
                if (config.universe && !topic[1]) {
                    payload.channel = msg.payload.channel || config.channel || parseInt(topic[0]) || 0
                } else {
                    payload.channel = msg.payload.channel || config.channel || parseInt(topic[1]) || 0
                }

                if(Array.isArray(msg.payload.data)) {
                    payload.offset = msg.payload.offset || payload.channel
                    node.server.setWithArray(payload.universe, payload.offset, msg.payload.data)
                } else if(Array.isArray(msg.payload.buckets)) {
                    node.server.setWithBuckets(payload.universe, msg.payload.buckets)
                } else {
                    node.server.setChannelValue(payload.universe, payload.channel, msg.payload)
                }
            }
        })
    }
    RED.nodes.registerType("sACN", sACN)
}