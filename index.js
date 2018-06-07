// Check for nodejs vs browser environment
const nodejs = (typeof window === 'undefined');
const THREE = require('three');
const fs = require('fs');

if(nodejs) {
  WebGL = require('node-webgl');
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const d = new JSDOM();
  global.window = d.window;
  global.navigator = window.navigator;

  Image = WebGL.Image;
  document = WebGL.document();
  document.setTitle("Tunnel");
  requestAnimationFrame = document.requestAnimationFrame;
}

var gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl2");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.canvas = canvas;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

const start = () => {

  const canvas = document.createElement("canvas",800,600);

  initGL(canvas);

  this.scene = new THREE.Scene({ background: 0xff0000 });

  this.light = new THREE.PointLight(0xff0000);
  this.light.position.x = 3;
  this.scene.add(this.light);

  this.light = new THREE.PointLight(0x00ff00);
  this.light.position.x = -3;
  this.scene.add(this.light);

  this.light = new THREE.PointLight(0x0000ff);
  this.light.position.z = 5;
  this.scene.add(this.light);

  this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  this.camera.position.z = 4.5;
  this.scene.add(this.camera);
  this.renderer = new THREE.WebGLRenderer({ canvas: canvas, context: gl });

  const bb = new THREE.BoxBufferGeometry(.25, .25, .25);
  const mat = new THREE.MeshStandardMaterial( {
    side: THREE.DoubleSide,
    color: 0xcccccc,
    roughness: .9,
  });

  let c, v;
  let d = new THREE.Vector3();
  let cent = new THREE.Vector3(0, 0, 0);
  const ran = .01;
  const cMin = new THREE.Vector3(-ran, -ran, -ran);
  const cMax = new THREE.Vector3(ran, ran, ran);

  const up = function(t) {
    this.rotation.setFromVector3(d.copy(this.position).addScalar(t));
    // this.position.add(this.vel);
    // if(this.position.distanceTo(cent) > 2.5) {
      // this.vel.multiplyScalar(-1);
      this.vel.add(d.copy(this.position).normalize().multiplyScalar(-.00005).clamp(cMin, cMax));
      this.vel.clamp(cMin, cMax);
      this.position.add(this.vel);
    // }
    //if(i==1) console.log(this.position.distanceTo(this.startPos));
  };
  let r;
  for(var i = 0; i < 1500; i++) {
    c = new THREE.Mesh(bb, mat);
    c.position.set(
      Math.random() - .5,
      Math.random() - .5,
      -Math.random()
    );
    r = Math.random();
    c.scale.set(
      r,
      r,
      r
    );

    c.vel = new THREE.Vector3(
      Math.random() - .5,
      Math.random() - .5,
      Math.random() - .5
    ).multiplyScalar(0).clone();
    c.position.multiplyScalar(Math.random() * 50.);
    c.startPos = c.position.clone();
    c.update = up.bind(c);
    this.scene.add(c);
  }
  // this.camera.lookAt(this.cube);

  document.on("resize", function (evt) {
    gl.viewportWidth=canvas.width;
    gl.viewportHeight=canvas.height;
  });

  const loop = (time) => {
    this.scene.children.map( c => {
      if(typeof c.update !== "undefined") {
        c.update(time*.001);
      }
    })
    this.renderer.clearColor = new THREE.Color(0xff0000);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(loop);
  }

  loop();
}


start();
