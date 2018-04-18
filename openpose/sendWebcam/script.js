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
// Runway: OpenPose Single Image Demo
// This example sends one image to Runway and draw all humans detected in the image
// p5.js is used to draw the human data sent from Runway
// You should select HTTP from the Input Panel
// 
// Cristóbal Valenzuela
// cris@runwayml.com
//
// ===============================================================

var capture;
var w = 400;
var h = 225;
var colors;

// This are all the body connections we want to draw
var bodyConnections = [
  ['Nose', 'Left_Eye'],
  ['Left_Eye', 'Left_Ear'],
  ['Nose', 'Right_Eye'],
  ['Right_Eye', 'Right_Ear'],
  ['Nose', 'Neck'],
  ['Neck', 'Right_Shoulder'],
  ['Right_Shoulder', 'Right_Elbow'],
  ['Right_Elbow', 'Right_Wrist'],
  ['Neck', 'Left_Shoulder'],
  ['Left_Shoulder', 'Left_Elbow'],
  ['Left_Elbow', 'Left_Wrist'],
  ['Neck', 'Right_Hip'],
  ['Right_Hip', 'Right_Knee'],
  ['Right_Knee', 'Right_Ankle'],
  ['Neck', 'Left_Hip'],
  ['Left_Hip', 'Left_Knee'],
  ['Left_Knee', 'Left_Ankle'],
]

// This array will get updated with all the humans detected in the image
var humans = [];

// This connection (to be later initialized)
var socket;

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  // A variable to hold the status of the connection
  var status = document.getElementById('status');

  // Create a connection with Runway
  // *You should update this address to match the URL provided by the app
  socket = io.connect('http://127.0.0.1:33200/query');

  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
    setInterval(sendImgToRunway,500,capture);
  });

  // When there is a data event, update the humans array
  socket.on('update_response', function(data) {
    humans = data.results.humans;
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
  // Set some style and colors
  strokeWeight(2);
  colors = [color('#00ff00'), color('#ffff00'), color('#ff0000'), color('#00ffff'), color('#ffffff'), color('#f4f'), color('#00ff'), color('#ffaf00'), color('#aff'), color('#aaf'), color('#33a'), color('#55f'), color('#771'), color('#15f'), color('#ff0000'), color('#00ff00'), color('#ffff00'), color('#ff0000')];

}

function sendImgToRunway(img){
  if(img){
    // update camera pixels
    img.loadPixels();
    // send data
    socket.emit('update_request', {
      data: img.canvas.toDataURL('image/jpeg'),
      model: "mobilenet_thin"
    });
  }else{
    console.warn("invalid pixels, skipping request to Runway");
  }
}

// p5 draw function
function draw() {
  // Every frame, draw the current video frame
  image(capture, 0, 0, w, h);
  // If there are humans detected, draw them in top of video frames
  if (humans.length > 0) {
    humans.forEach(human => drawHuman(human));
  }
}

// A function that connects joints based on data coming from OpenPose
function drawHuman(human) {
  bodyConnections.forEach((connection, i) => {
    let start = null;
    let endA = null;
    let endB = null;
    human.forEach(bodyPart => {
      const name = bodyPart[0];
      if (name === connection[0]) {
        start = bodyPart;
      } else if (name === connection[1]) {
        endA = bodyPart;
      } else if (connection[2] && name === connection[2]) {
        endB = bodyPart;
      }
    });
    stroke(colors[i]);
    if (start && endA && !endB) {
      line(start[1] * w, start[2] * h, endA[1] * w, endA[2] * h);
    } else if (start && endA && endB) {
      line(start[1] * w, start[2] * h, (endA[1] + endB[1]) / 2 * w, (endB[2] + endB[2]) / 2 * h);
    }
  });
}