import GUI from 'lil-gui'

export function setupUI(water) {
    const gui = new GUI({
        width: 400
    });

    const debugObject = {}

    // water color
    debugObject.troughColor = '#186691'
    debugObject.surfaceColor = '#9bd8c0'
    debugObject.peakColor = '#bbd8e0'
    
    // Water debug
    // gui.add(water.position, 'y').min(-5).max(5).step(0.01).name('waterHeight')
    gui.add(water.material.uniforms.uOpacity, 'value').min(0).max(1).step(0.01).name('Opacity')
    
    gui.add(water.material.uniforms.uWavesAmplitude, 'value').min(0).max(1).step(0.1).name('Amplitude')
    gui.add(water.material.uniforms.uWavesFrequency, 'value').min(0.01).max(1).step(0.01).name('Frequency')
    gui.add(water.material.uniforms.uWavesPersistence, 'value').min(0).max(1).step(0.001).name('Persistence')
    gui.add(water.material.uniforms.uWavesLacunarity, 'value').min(0).max(3).step(0.001).name('Lacunarity')
    gui.add(water.material.uniforms.uWavesIterations, 'value').min(1).max(6).step(1).name('Iterations')
    gui.add(water.material.uniforms.uWavesSpeed, 'value').min(0).max(5).step(0.001).name('Speed')
    
    gui.addColor(debugObject, 'troughColor').onChange(() => { water.material.uniforms.uTroughColor.value.set(debugObject.troughColor) })
    gui.addColor(debugObject, 'surfaceColor').onChange(() => { water.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
    gui.addColor(debugObject, 'peakColor').onChange(() => { water.material.uniforms.uPeakColor.value.set(debugObject.peakColor) })
    
    gui.add(water.material.uniforms.uPeakThreshold, 'value').min(-1.0).max(1.0).step(0.001).name('Peak Threshold')
    gui.add(water.material.uniforms.uPeakTransition, 'value').min(0).max(1.0).step(0.001).name('Peak Transition')
    gui.add(water.material.uniforms.uTroughThreshold, 'value').min(-1.0).max(1.0).step(0.001).name('Trough Threshold')
    gui.add(water.material.uniforms.uTroughTransition, 'value').min(0).max(1.0).step(0.001).name('Trough Transition')

    // Camera position debug
    // gui.add(camera.position, 'x').min(-5).max(5).step(0.01).name('cameraX')
    // gui.add(camera.position, 'y').min(-5).max(5).step(0.01).name('cameraY')
    // gui.add(camera.position, 'z').min(-5).max(5).step(0.01).name('cameraZ')
}



