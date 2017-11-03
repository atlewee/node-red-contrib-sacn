# node-red-contrib-sacn
Simple sACN output for Node-RED

Uses hhromic/e131-node library for the E1.31 (sACN) protocol.

## Usage:
Set desired universe and channel on the sACN output-node and then send pure values (0-255) to that node.

(Currently no support for dynamic universe/channels)