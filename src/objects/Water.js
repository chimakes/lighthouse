import * as THREE from 'three';
import waterVertexShader from '../shaders/water/vertex.glsl';
import waterFragmentShader from '../shaders/water/fragment.glsl';

export class Water extends THREE.Mesh {
    constructor(options) {
        super();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uEnvironmentMap: { value: options.environmentMap },

                uOpacity: { value: 0.8 },

                uTroughColor: { value: new THREE.Color('#1a6b79') },
                uSurfaceColor: { value: new THREE.Color('#98dcb7') },
                uPeakColor: { value: new THREE.Color('#a4bcbd') },

                uWavesAmplitude: { value: 0.15 },
                uWavesFrequency: { value: 0.14 },
                uWavesPersistence: { value: 0.6 },
                uWavesLacunarity: { value: 1.42 },
                uWavesIterations: { value: 3 },
                uWavesSpeed: { value: 0.2 },

                uPeakThreshold: { value: 0.8 },
                uPeakTransition: { value: 0.52 },
                uTroughThreshold: { value: 0.6 },
                uTroughTransition: { value: 0.75 },

                uFresnelStrength: { value: 0.3 },
                uFresnelPower: { value: 2.5 }
            },
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            transparent:true
        })

        this.geometry = new THREE.PlaneGeometry(50, 50, 
            options.resolution, options.resolution)
        this.rotation.x = - Math.PI / 2;
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
    }
}