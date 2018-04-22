// Copyright (C) 2018 Cristobal Valenzuela
// 
// This file is part of RunwayML.
// 
// RunwayML is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// RunwayML is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with RunwayML.  If not, see <http://www.gnu.org/licenses/>.
// 
// ===============================================================
//
// Runway: YOLO Send Webcam Demo
// This example sends a live webcam feed to Runway running YOLO to detect objects 
// p5.js is used to draw the objects detected
// You should select HTTP from the Input Panel
// 
// Cristóbal Valenzuela
// cris@runwayml.com
//
// ===============================================================

var capture;
var canvas;
var WIDTH = 400;
var HEIGHT = 225;

// By default the demo is not running until the user clicks start
var shouldLoop = false;

// All the objects detected with YOLO will be in this results variable
var results = [];

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  // A variable to hold the status of the connection
  var status = document.getElementById('status');
  var startBtn = document.getElementById('start');
  var stopBtn = document.getElementById('stop');

  // Create a connection with Runway
  // *You should update this address to match the URL provided by the app
  var socket = io.connect('http://127.0.0.1:33300/query');

  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
    // setInterval(sendImgToRunway,500,capture);
  });

   // When there is new data coming in, update the results array
  socket.on('update_response', function(data) {
    results = data.results;
    if (shouldLoop) {
      sendCanvasToRunway();
    }
  });

  // Start the loop: send an image, wait for response, send another one...
  function start() {
    shouldLoop = true;
    sendCanvasToRunway()
  }
  // Stop the loop
  function stop() {
    shouldLoop = false;
  }

  // Send the current canvas to Runway
  function sendCanvasToRunway(){
    socket.emit('update_request', {
      data: canvas.elt.toDataURL('image/jpeg')
    });
  }

  // Listen to start and stop event
  startBtn.addEventListener('click', start, false);
  stopBtn.addEventListener('click', stop, false);
});

// p5 setup function
function setup() {
  // Create a canvas
  canvas = createCanvas(WIDTH, HEIGHT);
  pixelDensity(1)
  // Create a video element. 
  capture = createCapture(VIDEO);
  capture.size(WIDTH, HEIGHT);
  capture.hide();
  // Set some style and colors
  strokeWeight(4);
  noFill();
  stroke(255,0,0);
}

// p5 draw function
function draw() {
  // Every frame, draw the current video frame
  image(capture, 0, 0, WIDTH, HEIGHT);

  // Loop through all the elements detected and draw a bounding box around them
  results.forEach(function(object, i) {
    var bounds = object.bounds;
    var x = bounds[0];
    var y = bounds[1];
    var w = bounds[2];
    var h = bounds[3];
    fill(0, 255, 0)
    noStroke();
    // Draw a text over the bounding box
    text(object.cat, x*WIDTH,  y*HEIGHT-5);
    noFill();
    strokeWeight(4);
    stroke(0, 255, 0);
    // Draw the bounding box
    rect(x*WIDTH, y*HEIGHT, w*WIDTH, h*HEIGHT);
  })
}