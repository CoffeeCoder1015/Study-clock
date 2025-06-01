varying vec2 vertexUV;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    vertexUV = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}