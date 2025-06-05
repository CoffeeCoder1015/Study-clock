varying vec2 vertexUV;
varying vec3 vNormal;

uniform vec3 lightPosition;
uniform float ambientLightIntensity;
uniform float radiusEarth;
uniform float radiusAtmosphere;

void main(){
    float intensity = 1.-0.7*dot(vNormal,normalize( cameraPosition ));
    gl_FragColor = vec4(0.13,0.3-intensity/10.,0.5,pow(intensity,1.5));
}