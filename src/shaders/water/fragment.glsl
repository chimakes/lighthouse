precision highp float;

uniform float uOpacity;
uniform samplerCube uEnvironmentMap;

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

void main()
{
    vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
    vec3 reflected = reflect(viewDirection, vNormal);
    reflected.x *= -1.0;

    vec4 reflectionColor = textureCube(uEnvironmentMap, reflected);

    float fresnel = uFresnelStrength * pow(1.0 - clamp(dot(viewDirection, vNormal), 0.0, 1.0), uFresnelPower);

    // mixing color value
    float trough2Surface = smoothstep(
        uTroughThreshold - uTroughTransition,
        uTroughThreshold + uTroughTransition,
        vWorldPosition.y
    );

    float trough2Peak = smoothstep(
        uPeakThreshold - uPeakTransition,
        uPeakThreshold + uPeakTransition,
        vWorldPosition.y
    );

    vec3 mixedColor1 = mix(uTroughColor, uSurfaceColor, trough2Surface);
    vec3 mixedColor2 = mix(mixedColor1, uPeakColor, trough2Peak);

    vec3 finalColor = mix(mixedColor2, reflectionColor.rgb, fresnel);

    gl_FragColor = vec4(finalColor, uOpacity);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}