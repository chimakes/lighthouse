import * as THREE from 'three'
import "./style.css"
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 400
})
const debugObject = {}

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

environmentMap.encoding = THREE.sRGBEncoding;

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
    (gltf) =>
    {
        gltf.scene.traverse((child) => {
            if(child.isMesh){
                Object.keys(textureMap).forEach(key=>{
                    
                    if(child.name.includes(key)){
                        const material = new THREE.MeshBasicMaterial({
                            map: loadedTextures.day[key]
                        })
                        child.material = material

                        if(child.material.map){
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

// water plane
const waterGeometry = new THREE.PlaneGeometry(20, 20, 128, 128)

// water color
debugObject.troughColor = '#186691'
debugObject.surfaceColor = '#9bd8c0'
debugObject.peakColor = '#bbd8e0'


const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader:  waterFragmentShader,
    transparent:true,
    uniforms:
    {
        uTime: { value: 0.0 },
        // uEnvironmentMap: { value: options.environmentMap },

        uOpacity: { value: 0.8 },

        uTroughColor: { value: new THREE.Color('#186691') },
        uSurfaceColor: { value: new THREE.Color('#9bd8c0') },
        uPeakColor: { value: new THREE.Color('#bbd8e0') },

        uWavesAmplitude: { value: 0.3 },
        uWavesFrequency: { value: 0.9 },
        uWavesPersistence: { value: 0.3 },
        uWavesLacunarity: { value: 2.0 },
        uWavesIterations: { value: 5 },
        uWavesSpeed: { value: .35 },

        uTroughThreshold:{ value: -0.01 },
        uTroughTransition:{ value: 0.12 },
        uPeakThreshold:{ value: 0.08 },
        uPeakTransition:{ value: 0.06 },

        uFresnelStrength: { value: 0.5 },
        uFresnelPower: { value: 1.3 }
    }
})



const water = new THREE.Mesh(waterGeometry, waterMaterial)

water.rotation.x = - Math.PI / 2
water.position.y = -1.05
scene.add(water)

// Water debug
// gui.add(water.position, 'y').min(-5).max(5).step(0.01).name('waterHeight')
gui.add(waterMaterial.uniforms.uOpacity, 'value').min(0).max(1).step(0.01).name('Opacity')

gui.add(waterMaterial.uniforms.uWavesAmplitude, 'value').min(0).max(1).step(0.1).name('Amplitude')
gui.add(waterMaterial.uniforms.uWavesFrequency, 'value').min(0.1).max(10).step(0.1).name('Frequency')
gui.add(waterMaterial.uniforms.uWavesPersistence, 'value').min(0).max(1).step(0.001).name('Persistence')
gui.add(waterMaterial.uniforms.uWavesLacunarity, 'value').min(0).max(3).step(0.001).name('Lacunarity')
gui.add(waterMaterial.uniforms.uWavesIterations, 'value').min(1).max(6).step(1).name('Iterations')
gui.add(waterMaterial.uniforms.uWavesSpeed, 'value').min(0).max(5).step(0.001).name('Speed')

gui.addColor(debugObject, 'troughColor').onChange(() => { waterMaterial.uniforms.uTroughColor.value.set(debugObject.troughColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
gui.addColor(debugObject, 'peakColor').onChange(() => { waterMaterial.uniforms.uPeakColor.value.set(debugObject.peakColor) })

gui.add(waterMaterial.uniforms.uPeakThreshold, 'value').min(-0.5).max(0.5).step(0.001).name('Peak Threshold')
gui.add(waterMaterial.uniforms.uPeakTransition, 'value').min(0).max(0.5).step(0.001).name('Peak Transition')
gui.add(waterMaterial.uniforms.uTroughThreshold, 'value').min(-0.5).max(0.5).step(0.001).name('Trough Threshold')
gui.add(waterMaterial.uniforms.uTroughTransition, 'value').min(0).max(0.5).step(0.001).name('Trough Transition')


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

window.addEventListener('resize', () =>
{
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
camera.position.x = 4
camera.position.y = 4

scene.add(camera)

// Camera position debug
// gui.add(camera.position, 'x').min(-5).max(5).step(0.01).name('cameraX')
// gui.add(camera.position, 'y').min(-5).max(5).step(0.01).name('cameraY')
// gui.add(camera.position, 'z').min(-5).max(5).step(0.01).name('cameraZ')

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()