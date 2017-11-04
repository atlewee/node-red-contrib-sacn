module.exports = function (RED) {
    function sACN(config) {
        RED.nodes.createNode(this, config)
        let node = this

        node.name = config.name
        node.server = RED.nodes.getNode(config.server)
        
        node.on("input", function (msg) {
            if(node.server) {
                let topic = msg.topic.split("/",2)
                let payload = {}
                payload.universe = parseInt(msg.payload.universe || topic[0] || config.universe || 0)
                payload.channel = parseInt(msg.payload.channel || !topic[1] ? topic[0] : topic[1] || config.channel || 0)

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