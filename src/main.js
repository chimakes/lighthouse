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
        day: "/textures/day/lighthouse_baked.jpg",
        night: ""
    },
    Mainisland: {
        day: "/textures/day/main_island_baked.jpg",
        night: ""
    },
    Animal: {
        day: "/textures/day/animal_baked.jpg",
        night: ""
    },
    Other: {
        day: "/textures/day/other_baked.jpg",
        night: ""
    },
    Flower: {
        day: "/textures/day/flower_baked.jpg",
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
    // '/models/lighthouse.glb',
    '/models/lighthouse_nobg.glb',
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
        scene.add(gltf.scene)        
    }
)

// water plane
const waterGeometry = new THREE.PlaneGeometry(20, 20, 128, 128)

// water color
debugObject.depthColor = '#70b0cf'
debugObject.surfaceColor = '#80CCCC'


const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader:  waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.15 },
        uBigWavesFrequency: { value: new THREE.Vector2(0.7, 0.8) },
        uBigWavesSpeed: { value: 0.7 },

        // color
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.03 },
        uColorMultiplier: { value: 1.5 },
    }
})



const water = new THREE.Mesh(waterGeometry, waterMaterial)

water.rotation.x = - Math.PI / 2
water.position.y = -1.05
scene.add(water)

// Water debug
gui.add(water.position, 'y').min(-5).max(5).step(0.01).name('waterHeight')

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.001).name('uBigWavesSpeed')

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

/**
 * Light
 */


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
const camera = new THREE.OrthographicCamera(
  -aspect * 3,
  aspect * 3,
  3,
  -3,
  1,
  1000
);
camera.position.x = 3.7
camera.position.y = 4.3
camera.position.z = 4
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
 * Sky
 */
// Add Sky
const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );

const sun = new THREE.Vector3();

/// GUI
const skyParameters = {
    turbidity: 10,
    rayleigh: 0.772,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function updateSky() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = skyParameters.turbidity;
    uniforms[ 'rayleigh' ].value = skyParameters.rayleigh;
    uniforms[ 'mieCoefficient' ].value = skyParameters.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = skyParameters.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - skyParameters.elevation );
    const theta = THREE.MathUtils.degToRad( skyParameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = skyParameters.exposure;
    renderer.render( scene, camera );

}

gui.add( skyParameters, 'turbidity', 0.0, 20.0, 0.1 ).onChange( updateSky );
gui.add( skyParameters, 'rayleigh', 0.0, 4, 0.001 ).onChange( updateSky );
gui.add( skyParameters, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( updateSky );
gui.add( skyParameters, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( updateSky );
gui.add( skyParameters, 'elevation', 0, 90, 0.1 ).onChange( updateSky );
gui.add( skyParameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSky );
// gui.add( skyParameters, 'exposure', 0, 1, 0.0001 ).onChange( updateSky );

updateSky();

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