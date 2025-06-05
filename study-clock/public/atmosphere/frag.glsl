varying vec2 vertexUV;
varying vec3 vNormal;

uniform vec3 lightPosition;
uniform float ambientLightIntensity;
uniform float radiusEarth;
uniform float radiusAtmosphere;

#define rAtmSqr radiusAtmosphere*radiusAtmosphere

float inAtmosphereDistance(vec3 pos, vec3 positionOfInterest){
    vec3 F = positionOfInterest-atmPos;
    vec3 unit = normalize(F);
    float xSqred = dot(pos,pos);
    
    float pdotu = dot(pos,unit);
    return -pdotu + sqrt(pow(pdotu,2.) - xSqred + rAtmSqr);
}


void main(){
    // reverse halo effect
    // float intensity = 1.-0.7*dot(vNormal,normalize( cameraPosition ));
    // gl_FragColor = vec4(0.13,0.3-intensity/10.,0.5,pow(intensity,1.5));
    
    // general lighting
    vec3 lightDirection = lightPosition-vNormal*radiusAtmosphere;
    float lightingIntensity = dot(normalize(lightDirection), vNormal);
    gl_FragColor = vec4(1.)+lightingIntensity;
}