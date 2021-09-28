import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// texture loader
const loader = new THREE.TextureLoader();
const star = loader.load('textures/sparkle.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( 1, .2, 16, 100 );

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++) {
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - 0.5
    // posArray[i] = (Math.random() - 0.5) * 5
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials

const material = new THREE.PointsMaterial({
    size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    map: star,
    transparent: true,
    color: 'pink'
})

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(sphere, particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor(new THREE.Color('#21282a'), 1);

// Mouse movement
document.addEventListener('mousemove', moveParticles)

let mouseX = 0, mouseY = 0, flag = 0;

function moveParticles(e) {
  mouseX = e.clientX / canvas.width * 20 - 10;
  mouseY = e.clientY / canvas.height * 20 - 10;
  flag = 1;
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    // code courtesy of nishit Sarvaiya https://www.youtube.com/watch?v=dLYMzNmILQA&t=17s
    const deltaTime = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    if(flag == 0) {
      particlesMesh.rotation.y += deltaTime * 0.05;
    }
    sphere.rotation.y = elapsedTime * .5;
    particlesMesh.rotation.x -= mouseY * deltaTime * 0.008;
    particlesMesh.rotation.y -= mouseX * deltaTime * 0.008;
  
    renderer.render(scene, camera);
  
    window.requestAnimationFrame(tick);
  };

tick()