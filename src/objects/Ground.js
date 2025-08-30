import * as THREE from 'three';
import waterVertexShader from '../shaders/ground/vertex.glsl';
import waterFragmentShader from '../shaders/ground/fragment.glsl';

const sandTexture = new THREE.TextureLoader().load('../textures/ocean_floor.png');

export class Ground extends THREE.Mesh {
    constructor() {
        super();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uTexture: { value: sandTexture },

                uCausticsColor: { value: new THREE.Color('#ffffff') },
                uCausticsSpeed: { value: 1.0 },
                uCausticsIntensity: { value: 0.3 },
                uCausticsScale: { value: 7.0 },
                uCausticsOffset: { value: 0.75 },
                uCausticsThickness: { value: 0.4 }
            },
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader
        })

        this.geometry = new THREE.PlaneGeometry(50, 50)
        this.rotation.x = - Math.PI / 2;
        this.position.y = -2.0
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
    }
}