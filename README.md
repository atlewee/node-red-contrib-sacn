# node-red-contrib-sacn
Node-RED node that controls lights via sACN



### set single value
```
msg.payload = 0 // (int: value in [0,255])


// Universe and channel can be set dynamically if not set in config:
msg.topic = "1/1" // (string: Universe/Channel)
msg.payload = 0


// If Universe is configured on the node, its enought to provide only the channel number in topic:
msg.topic = "1" // (string: Channel)
msg.payload = 0


// Universe and channel sent as an object will override anything provided in topic or node-config:
msg.payload = {
    "universe": 1,
    "channel": 1,
    "value": 0
}


// Transition can be set in config. Overidden when sent as object.
msg.topic = "1"  // (string: Channel)
msg.payload = {
    "value": 10,
    "transition": "rate",
    "transitionRate": 50,   //50ms for each step. Value going from 0 to 10 will result in 10x50ms. Total transition = 500ms.
}

msg.payload = {
    "universe": 1,
    "channel": 1,
    "value": 10
    "transition": "time"
    "transitionTime": 1000   //1000ms for total transition.
}


// It makes most sense to use "rate" because you probably don't want to // use 1 second going from value 50 to 49.
// Default transition value is "instant"
```


Package is currently in rapid development, I will bump to 1.0.0 when considered ready for production use.