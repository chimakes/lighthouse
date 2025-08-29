import * as THREE from 'three'
import "./style.css"
import { setupUI } from './ui.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from './objects/Water.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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

// // Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
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
        gltf.scene.position.set(0, -1, 0)
        // scene.add(gltf.scene)        
    }
)


const water = new Water({resolution: 256, environmentMap});
water.rotation.x = - Math.PI / 2
// water.position.y = -1.05
scene.add(water)


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
})

/**
 * Camera
 */
// Orthographic camera
const aspect = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -aspect * 3,
//   aspect * 3,
//   3,
//   -3,
//   1,
//   1000
// );
// camera.position.x = 3.7
// camera.position.y = 4.3
// camera.position.z = 4

// Perspective camera
// Perspictive camera


const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 20
camera.position.y = 20

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true

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

    // update water
    water.update(elapsedTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
setupUI(water);