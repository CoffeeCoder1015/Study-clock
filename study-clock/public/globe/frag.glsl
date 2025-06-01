varying vec2 vertexUV;

uniform sampler2D globeTexture;

void main(){
    gl_FragColor = texture2D(globeTexture,vertexUV);
}