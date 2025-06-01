varying vec2 vertexUV;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 lightPosition;
uniform float ambientLightIntensity;

void main(){
    float intensity = dot(normalize(lightPosition),vNormal);
    vec3 diff = lightPosition-vPosition;
    float dist = sqrt(dot(diff,diff));
    gl_FragColor = mix( texture2D(nightTexture,vertexUV),texture2D(dayTexture,vertexUV),intensity*dist/15.)+intensity/5.;
}