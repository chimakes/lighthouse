precision highp float;

uniform float uOpacity;
uniform vec3 uSurfaceColor;

varying float vElevation;
void main()
{
    gl_FragColor = vec4((uSurfaceColor * (vElevation / 0.05)), uOpacity);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}