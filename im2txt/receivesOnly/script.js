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
// Runway: im2txt receiving data Demo
// This example just receives incoming data from Runway.
// No need to send images or data from here.
// You should select Camera from the Input Panel
//
// Cristóbal Valenzuela
// cris@runwayml.com
//
// ===============================================================


// Create a connection to the Runway HTTP Server
// You should select Camera from the Input Panel
// *You should update this address to match the URL provided by the app
var socket = io.connect('http://127.0.0.1:3333');

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", function(event) {

  // Get the DOM log element
  var status = document.getElementById('status');
  var log = document.getElementById('log');
  
  // When a connection is established
  socket.on('connect', function() {
    status.innerHTML = 'Connected';
  });
  
  // When there is a data event, update the log element
  socket.on('data', function(data) {
    log.innerHTML = data.results[0].caption;
  });
});
