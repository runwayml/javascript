
// Copyright (C) 2019 Runway AI Examples
// 
// This file is part of Runway AI Examples.
// 
// Runway-Examples is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Runway-Examples is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Runway.  If not, see <http://www.gnu.org/licenses/>.
// 
// ===========================================================================

// RUNWAY
// www.runwayapp.ai

// SPADE-COCO Noise2D Image Synthesizer Demo:
// Generates noise patterns to be processed in Runway
// Made by jpyepez


// Runway Color Setup
//////////////////////

// spade hex colors
// from Runway's exported CSV file
const spade_hex = ["#000000", "#d60000", "#8c3bff", "#018700", "#00acc6", "#97ff00", "#ff7ed1", "#6b004f", "#ffa52f", "#00009c", "#857067", "#004942", "#4f2a00", "#00fdcf", "#bcb6ff", "#95b379", "#bf03b8", "#2466a1", "#280041", "#dbb3af", "#fdf490", "#4f445b", "#a37c00", "#ff7066", "#3f806e", "#82000c", "#a37bb3", "#344d00", "#9ae4ff", "#eb0077", "#2d000a", "#5d90ff", "#00c61f", "#5701aa", "#001d00", "#9a4600", "#959ea5", "#9a425b", "#001f31", "#c8c300", "#ffcfff", "#00bd9a", "#3615ff", "#2d2424", "#df57ff", "#bde6bf", "#7e4497", "#524f3b", "#d86600", "#647438", "#c17287", "#6e7489", "#809c03", "#bd8a64", "#623338", "#cacdda", "#6beb82", "#213f69", "#a17eff", "#fd03ca", "#75bcfd", "#d8c382", "#cda3cd", "#6d4f00", "#006974", "#469e5d", "#93c6bf", "#f9ff00", "#bf5444", "#00643b", "#5b4fa8", "#521f64", "#4f5eff", "#7e8e77", "#b808f9", "#8a91c3", "#b30034", "#87607e", "#9e0075", "#ffddc3", "#500800", "#1a0800", "#4b89b5", "#00dfdf", "#c8fff9", "#2f3415", "#ff2646", "#ff97aa", "#03001a", "#c860b1", "#c3a136", "#7c4f3a", "#f99e77", "#566464", "#d193ff", "#2d1f69", "#411a34", "#af9397", "#629e99", "#bcdd7b", "#ff5d93", "#0f2823", "#b8bdac", "#743b64", "#0f000c", "#7e6ebc", "#aaaaaa", "#ff4600", "#7e0087", "#ffcd3d", "#2f3b42", "#fda5ff", "#89013d", "#752b01", "#0a8995", "#050052", "#8ed631", "#52c372", "#465970", "#570121", "#a52101", "#90934b", "#00421d", "#8000d1", "#1dc331", "#bf3883", "#f4ffd4", "#00d3ff", "#6900f7", "#9cbad1", "#79d8aa", "#69565d", "#006905", "#36369c", "#018246", "#3c3732", "#07a5ef", "#ff802f", "#a754b8", "#675982", "#72ffff", "#d88701", "#bad3ff", "#8e362f", "#a7a080", "#007ce2", "#8e7e8e", "#994487", "#003996", "#aeaac8", "#a06062", "#4b3a77", "#6b8282", "#f0dde6", "#ffbad3", "#363ea7", "#b3ffa8", "#0c1107", "#d6526e", "#959efd", "#7c7e00", "#759eb8", "#db877e", "#111318", "#d482d4", "#9e00bf", "#dbefff", "#8eaa9a", "#706442", "#8c682f", "#084d5e", "#9cb844", "#d8ddd4", "#caff6b", "#b364eb", "#465d33", "#009e7c", "#c14100", "#4fbcba", "#d88ab1", "#5b72b5", "#4b4101", "#95825d"];
const spade_colors = spade_hex.map( hex => new THREE.Color(hex));

// useful functions
const getRandomColor = color => new THREE.Vector3(color.r, color.g, color.b);
const randInt = (min, max) => Math.floor(min + Math.floor((max-min)*Math.random())); 
const getSeed2D = () => new THREE.Vector2( 100.*Math.random(), 100.*Math.random()); // random seeds for noise shader

// THREE.js Scene
//////////////////////

// scene size
const sceneWidth = 512;
const sceneHeight = 512;

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, sceneWidth/sceneHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
});
renderer.setSize(sceneWidth, sceneHeight);
document.body.appendChild( renderer.domElement );

camera.position.z = .65;

// create a light
const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
scene.add(light);

// create plane for shader display
const geometry = new THREE.PlaneBufferGeometry(1, 1);

// shader
// generate color uniforms for shader
const colorUniforms = Array.from({length: 4}, () => getRandomColor(spade_colors[randInt(0, spade_colors.length)]));
const seed = getSeed2D();

const uniforms = {
    iGlobalTime: {
        type: "f",
        value: 1.
    },
    iResolution: {
        type: "v2",
        value: new THREE.Vector2()
    },
    uColors: {
        type: "v3v",
        value: colorUniforms
    },
    uSeed: {
        type: "v2",
        value: seed
    }
};
uniforms.iResolution.value.set(1, 1);

// material from shader
const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('general').textContent,
    fragmentShader: document.getElementById('frag1').textContent
});
const obj = new THREE.Mesh(geometry, material);
scene.add(obj);


// prepare to render
const clock = new THREE.Clock();

const render = () => {
    material.uniforms.iGlobalTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();

const onWindowResize = () => {
    camera.aspect = sceneWidth/sceneHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneWidth, sceneHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Send to Runway
//////////////////////

// generate image data
const strMime = "image/jpeg";
let imgData = renderer.domElement.toDataURL(strMime);
let data = {"semantic_map": imgData};

// function to send data to runway
const postData = async (url, data) => {

    try {
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });

        console.log(response);

    } catch(error) {
        alert('Please check Runway\'s GET port and make sure a workspace with SPADE-COCO is running.');
        console.error(error);
    }
}

// UI elements
const btnShader = document.getElementById("btn_shader");
const btnSend = document.getElementById("btn_send");
const portInput = document.getElementById("port");

// post parameters
let postUrl = `http://localhost:${portInput.value}/query`;

// set up listeners
btnShader.addEventListener('click', () => {
    uniforms.uColors.value = Array.from({length: 4}, () => getRandomColor(spade_colors[randInt(0, spade_colors.length)]));
    uniforms.uSeed.value = getSeed2D();
});

portInput.onblur =  () => {
    postUrl = `http://localhost:${portInput.value}/query`;
};

btnSend.addEventListener('click', () => {
    imgData = renderer.domElement.toDataURL(strMime);
    data = {"semantic_map": imgData};
    postData(postUrl, data)
});

