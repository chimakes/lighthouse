import * as THREE from 'three';
import firefliesVertexShader from '../shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from '../shaders/fireflies/fragment.glsl'

export class Fireflies extends THREE.Mesh {
    constructor() {
        super();

        this.geometry = new THREE.BufferGeometry()
        const count = 40
        const positionArray = new Float32Array(count * 3)
        const scaleArray = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
            positionArray[i * 3 + 1] = (Math.random()) * 2.5
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

            scaleArray[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

        // Material
        this.material = new THREE.ShaderMaterial({
            uniforms:
            {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 200 }
            },
            vertexShader: firefliesVertexShader,
            fragmentShader: firefliesFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        this.points = new THREE.Points(this.geometry, this.material)
    }

    resize() {
        this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
    }
}