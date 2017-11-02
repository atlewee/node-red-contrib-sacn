module.exports = function (RED) {
    function sACN(config) {
        RED.nodes.createNode(this, config)
        
        var node = this

        node.name = config.name
        node.server = RED.nodes.getNode(config.server)
        node.universe = config.universe
        node.channel = config.channel

        node.on("input", function (msg) {
            if(node.server) {
                node.server.setChannelValue(node.universe, node.channel, msg.payload)
                node.error("sender: msg.payload")
            }
        })
    }

    RED.nodes.registerType("sACN", sACN)
}