precision highp float;

uniform float uOpacity;

uniform vec3 uTroughColor;
uniform vec3 uSurfaceColor;
uniform vec3 uPeakColor;

uniform float uTroughThreshold;
uniform float uTroughTransition;
uniform float uPeakThreshold;
uniform float uPeakTransition;

uniform float uFresnelStrength;
uniform float uFresnelPower;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying float vElevation;

void main()
{
    
    // mixing color value
    float trough2Surface = smoothstep(
        uTroughThreshold - uTroughTransition,
        uTroughThreshold + uTroughTransition,
        vElevation
    );

    float trough2Peak = smoothstep(
        uPeakThreshold - uPeakTransition,
        uPeakThreshold + uPeakTransition,
        vElevation
    );

    vec3 mixedColor1 = mix(uTroughColor, uSurfaceColor, trough2Surface);
    vec3 mixedColor2 = mix(mixedColor1, uPeakColor, trough2Peak);

    gl_FragColor = vec4(mixedColor2, uOpacity);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}

