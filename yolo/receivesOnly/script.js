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
// Runway: YOLO Webcam Demo
// This example receives incoming data from Runway.
// p5.js is used to draw rectangles
// You should select Camera from the Input Panel
//
// Cristóbal Valenzuela
// cris@runwayml.com
//
// ===============================================================

var capture;
var WIDTH = 432;
var HEIGHT = 368;

// All the objects detected with YOLO will be in this results variable
var results = [];

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  // A variable to hold the status of the connection
  var status = document.getElementById('status');

  // Create a connection with Runway
  // *You should update this address to match the URL provided by the app
  var socket = io.connect('http://127.0.0.1:3333');

  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
  });

  // Whenever there is data coming fron Runway, update the results variable
  socket.on('data', function(data) {
    results = data.results;
  });
});

// p5 setup function
function setup() {
  // Create a canvas
  createCanvas(WIDTH, HEIGHT);
  // Create a video element. 
  // Although we are getting the images from Runway, this is just to show the video behind
  capture = createCapture(VIDEO);
  capture.size(WIDTH, HEIGHT);
  // Hide the video element. We will be showing only the canvas
  capture.hide();
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