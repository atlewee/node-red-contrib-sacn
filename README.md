# node-red-contrib-sacn
Node-RED node that controls lights via sACN



### set single value
```
msg.payload = 0 // (int: value in [0,255])


// If you want, universe and channel can be set dynamically providing them in the topic:
msg.topic = "1/1" // (string: Universe/Channel)
msg.payload = 0


// If Universe is configured on the node, its enought to provide only the channel number in topic:
msg.topic = "1" // (string: Channel)
msg.payload = 0


// Universe and channel sent as an object will override anything provided in topic or node-config:
msg.payload = {
    universe = 1,
    channel = 1,
    value = 0
}
```

### Set with array

```
msg.payload = {
  data: [0, 0, ...] // [int]: DMX data, length <= 512
};
// Universe can also be set in topic or in object just like single value above.
```


### Set with array and offset

```
msg.payload = {
  data: [0, ...], // [int]: DMX data, data.length <= 512
  offset: 0       // int: offset (first DMX channel in the array)
};

// Offset can also be set in the topic:
msg.topic = "1/10"
msg.payload = {
  data: [10, 20, 30] // [int]: DMX data, length <= 512
};
// This results in channel 10=10, 11=20, 12=30
```


### set with multiple values

```
msg.payload = {
  buckets: [
    {channel: 0, value: 255},
    {channel: 4, value: 0},
    ...
  ]
};
```

Todo:
- Fading/Transition