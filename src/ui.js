import GUI from 'lil-gui'

export function setupUI(water, ground, fireflies, camera) {
    const gui = new GUI({
        width: 250
    });

    const debugObject = {}

    // water color
    debugObject.troughColor = '#186691'
    debugObject.surfaceColor = '#9bd8c0'
    debugObject.peakColor = '#bbd8e0'
    
    // Water debug
    gui.add(water.position, 'y').min(-5).max(5).step(0.01).name('waterHeight')
    gui.add(water.material.uniforms.uOpacity, 'value').min(0).max(1).step(0.01).name('Opacity')
    
    gui.add(water.material.uniforms.uWavesAmplitude, 'value').min(0).max(1).step(0.01).name('Amplitude')
    gui.add(water.material.uniforms.uWavesFrequency, 'value').min(0.01).max(1).step(0.01).name('Frequency')
    gui.add(water.material.uniforms.uWavesPersistence, 'value').min(0).max(1).step(0.001).name('Persistence')
    gui.add(water.material.uniforms.uWavesLacunarity, 'value').min(0).max(3).step(0.001).name('Lacunarity')
    gui.add(water.material.uniforms.uWavesIterations, 'value').min(1).max(6).step(1).name('Iterations')
    gui.add(water.material.uniforms.uWavesSpeed, 'value').min(0).max(2).step(0.001).name('Speed')
    
    gui.addColor(debugObject, 'troughColor').onChange(() => { water.material.uniforms.uTroughColor.value.set(debugObject.troughColor) })
    gui.addColor(debugObject, 'surfaceColor').onChange(() => { water.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
    gui.addColor(debugObject, 'peakColor').onChange(() => { water.material.uniforms.uPeakColor.value.set(debugObject.peakColor) })
    
    gui.add(water.material.uniforms.uPeakThreshold, 'value').min(-1.0).max(1.0).step(0.001).name('Peak Threshold')
    gui.add(water.material.uniforms.uPeakTransition, 'value').min(0).max(1.0).step(0.001).name('Peak Transition')
    gui.add(water.material.uniforms.uTroughThreshold, 'value').min(-1.0).max(1.0).step(0.001).name('Trough Threshold')
    gui.add(water.material.uniforms.uTroughTransition, 'value').min(0).max(1.0).step(0.001).name('Trough Transition')
 
    gui.add(water.material.uniforms.uFresnelStrength, 'value').min(0).max(1.0).step(0.001).name('Fresnel Scale')
    gui.add(water.material.uniforms.uFresnelPower, 'value').min(0).max(3.0).step(0.001).name('Fresnel Power')

    // ground debug
    gui.add(ground.material.uniforms.uCausticsIntensity, 'value').min(0).max(2).name('Caustics Intensity');
    gui.add(ground.material.uniforms.uCausticsScale, 'value').min(0).max(20).name('Caustics Scale');
    gui.add(ground.material.uniforms.uCausticsSpeed, 'value').min(0).max(1).name('Caustics Speed');
    gui.add(ground.material.uniforms.uCausticsOffset, 'value').min(-2).max(2).name('Caustics Offset');
    gui.add(ground.material.uniforms.uCausticsThickness, 'value').min(0).max(1).name('Caustics Thickness');

    // fireflies debug
    gui.add(fireflies.material.uniforms.uSize, 'value').min(0).max(500).step(1).name('Fireflies Size')

    // Camera position debug
    gui.add(camera.position, 'x').min(-10).max(25).step(0.01).name('cameraX')
    gui.add(camera.position, 'y').min(-10).max(25).step(0.01).name('cameraY')
    gui.add(camera.position, 'z').min(-10).max(25).step(0.01).name('cameraZ')
}

export function setupGltfGUI(gltfScene){
    const gui = new GUI({
        width: 250
    });

    gui.add(gltfScene.position, 'x').min(-5).max(5).step(0.01).name('Lighthouse position X')
    gui.add(gltfScene.position, 'y').min(-5).max(5).step(0.01).name('Lighthouse position Y')
    gui.add(gltfScene.position, 'z').min(-5).max(5).step(0.01).name('Lighthouse position Z')
}

