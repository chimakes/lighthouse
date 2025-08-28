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

                uOpacity: { value: 0.5 },

                uTroughColor: { value: new THREE.Color('#186691') },
                uSurfaceColor: { value: new THREE.Color('#9bd8c0') },
                uPeakColor: { value: new THREE.Color('#bbd8e0') },

                uWavesAmplitude: { value: 0.5 },
                uWavesFrequency: { value: 0.16 },
                uWavesPersistence: { value: 0.38 },
                uWavesLacunarity: { value: 1.5 },
                uWavesIterations: { value: 6 },
                uWavesSpeed: { value: 0.3 },

                uTroughThreshold: { value: -0.7 },
                uTroughTransition: { value: 0.5 },
                uPeakThreshold: { value: 0.36 },
                uPeakTransition: { value: 0.5 },

                uFresnelStrength: { value: 0.5 },
                uFresnelPower: { value: 1.3 }
            },
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            transparent:true
        })

        this.geometry = new THREE.PlaneGeometry(20, 20, 
            options.resolution, options.resolution)
        this.rotation.x = - Math.PI / 2;
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
    }
}