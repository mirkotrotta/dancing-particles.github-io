import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model'

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  50, 
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;
camera.position.y = 1;


/*------------------------------
Mesh
------------------------------*/
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial( { 
  color: 0x00ff00,
} );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls( camera, renderer.domElement );
controls.enable = false



/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/*------------------------------
Models
------------------------------*/
const dancer = new Model({
  name: 'dancer',
  file: './models/dancer.glb',
  scene: scene,
  color1: '#d32e5e',
  color2: '#13AD80',
  background: '#1c1c1c',
  placeOnLoad: true,
})
const pineapple = new Model ({
  name: 'pineapple',
  color1: '#f5df4d',
  color2: '#2ed3a3',
  background: '#1c1c1c',
  file: './models/pineapple.glb',
  scene: scene
})

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('.button')
buttons[0].addEventListener('click', () => {
  dancer.add()
  pineapple.remove()
})
buttons[1].addEventListener('click', () => {
  dancer.remove()
  pineapple.add()
})

/*------------------------------
Clock
------------------------------*/
const Clock = new THREE.Clock()


/*------------------------------
Loop
------------------------------*/
const animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  if (dancer.isActive){
    dancer.particlesMaterial.uniforms.uTime.value = Clock.getElapsedTime()
  }
  if (pineapple.isActive) {
    pineapple.particlesMaterial.uniforms.uTime.value = Clock.getElapsedTime()
  }

  
};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );


/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  const x = e.clientX
  const y = e.clientY 

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, .5, -.5, x),
    x: gsap.utils.mapRange(0, window.innerHeight, .5, -.5, y)
  })
}
window.addEventListener('mousemove', onMouseMove)