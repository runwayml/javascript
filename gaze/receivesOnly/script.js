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
// Runway: Gaze Demo
// This example receives receives incoming data from Runway.
// p5.js is used to draw the human data sent from Runway
// You should select Camera from the Input Panel
//
// Cristóbal Valenzuela
// Dan Oved
//
// ===============================================================

var capture;
var w = 432;
var h = 368;
var colors;

// This array will get updated with all the gazes detected in the image
var detectedGazes = [];

// Create a connection with Runway
// *You should update this address to match the URL provided by the app
var socket = io.connect('http://127.0.0.1:3333');

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  // A variable to hold the status of the connection
  var status = document.getElementById('status');

  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
    console.log('connected');
  });

  // When there is a data event, update the humans array
  socket.on('data', function(data) {
    detectedGazes = data.results.estimated_gazes;
  });
});

// p5 setup function
function setup() {
  // Create a canvas
  createCanvas(w, h);
  // Create a video element. 
  // Although we are getting the images from Runway, this is just to show the video behind
  capture = createCapture(VIDEO);
  capture.size(w, h);
  // Hide the video element. We will be showing only the canvas
  capture.hide();
  noStroke();
  fill(255, 0, 0);
}

// p5 draw function
function draw() {
  // Every frame, draw the current video frame
  image(capture, 0, 0, w, h);
  // Draw the current detected gazes
  detectedGazes.forEach(gaze => drawGaze(gaze));
}

// A function that connects joints based on data coming from OpenPose
function drawGaze(gaze) {
  const x = constrain(map(gaze[0], -10, 10, 0, width), 0, width);
  const y = constrain(map(gaze[1], -2.5, -20, 0, height), 0, height);
  ellipse(x, y, 15, 15);
}