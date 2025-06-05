varying vec2 vertexUV;
varying vec3 vNormal;

void main(){
    vertexUV = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}