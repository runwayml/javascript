<p align="center">
  <img src="resources/runway_icon.png" width="95">
  <img src="resources/js_icon.png" width="90">
</p>

# Runway + JavaScript

A collection of stand alone examples connecting [Runway](https://runwayml.com/) to JavaScript.
Examples are separated by current available models.

## Examples

- [im2txt](/im2txt)
  - [Receiving data from Runway](/im2txt/receivesOnly)
  - [Sending live webcam feed](/im2txt/sendWebcam)
- [OpenPose](/openpose)
  - [Receiving data from Runway](/openpose/receivesOnly)
  - [Sending live webcam feed](/openpose/sendWebcam)
  - [Sending static images](/openpose/sendImage)
- [YOLO](/yolo)
  - [Receiving data from Runway](/yolo/receivesOnly)
  - [Sending live webcam feed](/yolo/sendWebcam)
- [Gaze Detection](/gaze)
  - [Receiving data from Runway](/gaze/receivesOnly)

## Library

Ideally this will become a JavaScript Library that manages the socket connections. For now all examples are using [socket.io](https://socket.io/) to get real-time data. Some examples use [p5.js](https://p5js.org/) to draw things on the canvas.

## Contributing

This is still a work in progress. Contributions are welcomed!

