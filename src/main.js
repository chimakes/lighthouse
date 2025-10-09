import * as THREE from 'three'
import "./style.css"
import { setupUI } from './ui.js';
import { setupGltfGUI } from './ui.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from './objects/Water.js'
import { Ground } from './objects/Ground.js'
import { Fireflies } from './objects/Fireflies.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/px.png', // positive x
    '/environmentMaps/nx.png', // negative x 
    '/environmentMaps/py.png', // positive y
    '/environmentMaps/ny.png', // negative y
    '/environmentMaps/pz.png', // positive z
    '/environmentMaps/nz.png'  // negative z
]);

scene.background = environmentMap;  // fills entire background
scene.environment = environmentMap; // adds reflections

/**
 * Loading Manager
 */
const loadingManager = new THREE.LoadingManager()

const loadingScreen = document.querySelector(".loading-screen")
const loadingScreenButton = document.querySelector(".loading-screen-button")

loadingManager.onLoad = function() {
    loadingScreenButton.style.padding = "1rem 3rem"
    loadingScreenButton.style.fontSize = "3rem"
    loadingScreenButton.style.border = "8px solid #28679bff"
    loadingScreenButton.style.borderRadius = "0.8em"
    loadingScreenButton.style.outline = "none"
    loadingScreenButton.style.cursor = "pointer"
    loadingScreenButton.style.background =
        "linear-gradient(to right, #f1f8d5ff 50%, #d6ebffff 50%)"
    loadingScreenButton.style.backgroundSize = "200% 100%"
    loadingScreenButton.style.backgroundPosition = "right bottom"
    loadingScreenButton.style.color = "#28679bff"
    loadingScreenButton.style.transition =
        "background-position 0.5s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease"
    loadingScreenButton.textContent = "Enter!"

    // Hover in
    loadingScreenButton.addEventListener("mouseenter", () => {
        loadingScreenButton.style.backgroundPosition = "left bottom"
        loadingScreenButton.style.transform = "scale(1.1)"
        loadingScreenButton.style.color = "#28679bff"
    })

    // Hover out
    loadingScreenButton.addEventListener("mouseleave", () => {
        loadingScreenButton.style.backgroundPosition = "right bottom"
        loadingScreenButton.style.transform = "scale(1)"
        loadingScreenButton.style.color = "#28679bff"
    })
    
    loadingScreenButton.addEventListener("click", (e) => {
        loadingScreen.style.display = 'none'

        startIntroCameraAnimation()
        startBackgroundMusic()
    })
}

// // Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Texture
 */
const textureMap = {
    LightHouse: {
        day: "/textures/day/lighthouse_day.jpg",
        night: ""
    },
    Mainisland: {
        day: "/textures/day/main_island_day.jpg",
        night: ""
    },
    Animal: {
        day: "/textures/day/animal_day.jpg",
        night: ""
    },
    Other: {
        day: "/textures/day/other_day.jpg",
        night: ""
    }
}

const loadedTextures = {
    day: {},
    night: {}
}

Object.entries(textureMap).forEach(([key, paths]) => {
    const dayTexture = textureLoader.load(paths.day);
    dayTexture.flipY = false
    dayTexture.colorSpace = THREE.SRGBColorSpace
    loadedTextures.day[key] = dayTexture;

    const nightTexture = textureLoader.load(paths.night);
    dayTexture.flipY = false
    dayTexture.colorSpace = THREE.SRGBColorSpace
    loadedTextures.night[key] = nightTexture;
})

// Emission material
const emissionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Model
 */
gltfLoader.load(
    '/models/lighthouse.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                Object.keys(textureMap).forEach(key => {

                    if (child.name.includes(key)) {
                        const material = new THREE.MeshBasicMaterial({
                            map: loadedTextures.day[key]
                        })
                        child.material = material

                        if (child.material.map) {
                            child.material.map.minFilter = THREE.LinearFilter
                        }
                    }
                })
            }
        })

        const lighthouseEmission1 = gltf.scene.children.find(child => child.name === 'lighthouse_top_emission')
        const lighthouseEmission2 = gltf.scene.children.find(child => child.name === 'lighthouse_window_emission')

        lighthouseEmission1.material = emissionMaterial
        lighthouseEmission2.material = emissionMaterial

        gltf.scene.scale.set(0.3, 0.3, 0.3)
        gltf.scene.position.set(1.18, 0.12, 1.55)
        scene.add(gltf.scene)

        // setupGltfGUI(gltf.scene)
    }
)



const fireflies = new Fireflies()
fireflies.points.position.x = 0.5
fireflies.points.position.z = 1
scene.add(fireflies.points)

const water = new Water({resolution: 256, environmentMap});
water.rotation.x = - Math.PI / 2
scene.add(water)

const ground = new Ground();
scene.add(ground);


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Perspective camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 1000)
const cameraPosition = 10
camera.position.x = cameraPosition
camera.position.y = cameraPosition
camera.position.z = cameraPosition

scene.add(camera)


// intro camera animation
function startIntroCameraAnimation(){
    const t1 = gsap.timeline({
        duration: 0.8
    })

    t1.fromTo(
        camera.position,
        {
            x: 20,
            y: 25,
            z: 20,
        },
        {
            x: cameraPosition,
            y: cameraPosition,
            z: cameraPosition,
            duration: 2,
            ease: "power1.inOut"
        }
    )
}



/**
 * Background Music
 */
function startBackgroundMusic(){
    const listener = new THREE.AudioListener()
    camera.add(listener)

    const audioLoader = new THREE.AudioLoader()

    const backgroundSound = new THREE.Audio(listener)

    audioLoader.load('sounds/seagull_and_wave.mp3', function(buffer) {
        backgroundSound.setBuffer(buffer)
        backgroundSound.setLoop(true)
        backgroundSound.setVolume(0.5)

        backgroundSound.play()
    })
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    const aspect = sizes.width / sizes.height
    camera.left = -aspect * 3
    camera.right = aspect * 3
    camera.top = 3
    camera.bottom = -3

    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update fireflies
    fireflies.resize()
})


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true
controls.dampingFactor = 0.01;

controls.minPolarAngle  = 0.85
controls.maxPolarAngle  = Math.PI / 2.7
controls.minAzimuthAngle = 0.5
controls.maxAzimuthAngle = Math.PI / 3.0

// controls.minZoom = 0.9
// controls.maxZoom = 1.5
controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update fireflies
    fireflies.update(elapsedTime);

    // update water and ground
    water.update(elapsedTime);
    ground.update(elapsedTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
setupUI(water, ground, fireflies, camera);