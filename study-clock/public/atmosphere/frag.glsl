varying vec2 vertexUV;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    float intensity = 1.-0.7*dot(vNormal,normalize( cameraPosition ));
    gl_FragColor = vec4(0.13,0.3-intensity/10.,0.5,pow(intensity,1.5));
}