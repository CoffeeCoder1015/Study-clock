varying vec2 vertexUV;
varying vec3 vNormal;

uniform vec3 lightPosition;
uniform float ambientLightIntensity;
uniform float radiusEarth;
uniform float radiusAtmosphere;

#define rAtmSqr radiusAtmosphere*radiusAtmosphere

#define PI 3.1415926535897932384626433832795

float inAtmosphereDistance(vec3 pos, vec3 positionOfInterest){
    vec3 F = positionOfInterest-pos;
    vec3 unit = normalize(F);
    float xSqred = dot(pos,pos);
    
    float pdotu = dot(pos,unit);
    return -pdotu + sqrt(pow(pdotu,2.) - xSqred + rAtmSqr);
}


float gammaCorrection(float x){
    return x*x - 0.25;
}

float sigmoid(float x){
    return 1. / (1. + exp(-x));
}

float dmap(float x, float theta){
    float diff = abs( PI/2. - theta );
    // if(diff < exp(-3.*theta/x)){
    //     return x;
    // }
    return -x;
}

float channelColoration(float dist,float cosTheta, float specificConst){
    float thetaSqr = pow( acos(cosTheta),2. );
    float mappedDistance = dmap(dist,acos(cosTheta));
    float expDec = exp(-specificConst*mappedDistance*thetaSqr);
    return gammaCorrection(sigmoid(
        expDec*pow(cosTheta,2.)
    ));
}


vec3 rrgb(vec3 pos){
    vec3 F = lightPosition-pos;
    vec3 unit = normalize(F);
    float pdotu = dot(pos,unit);
    float xSqred = dot(pos,pos);
    float cosTheta = pdotu / sqrt(xSqred);

    float sqrr = pow(pdotu,2.) - xSqred + rAtmSqr;
    float dist = -pdotu + sqrt(abs(sqrr));
    

    vec3 rawColors = vec3(
        channelColoration(dist,cosTheta,0.21),
        channelColoration(dist,cosTheta,0.33),
        channelColoration(dist,cosTheta,1.0)
    );
    
    float totalContribution = rawColors.x+rawColors.y+rawColors.z;
    float exposureCoeff = 3.*cosTheta/totalContribution;
    vec3 finalColor = rawColors*exposureCoeff;
    return finalColor;
}

void main(){
    // reverse halo effect
    float intensity = 1.-0.7*dot(vNormal,normalize( cameraPosition ));
    // gl_FragColor = vec4(0.13,0.3-intensity/10.,0.5,pow(intensity,1.5));
    
    // general lighting
    vec3 lightDirection = lightPosition-vNormal*radiusAtmosphere;
    float lightingIntensity = dot(normalize(lightDirection), vNormal);
    // gl_FragColor = vec4(1.)+lightingIntensity;
    
    // handroll rayleigh
    vec3 lightadj = rrgb(radiusEarth*vNormal);
    gl_FragColor = vec4(lightadj,pow(intensity,1.5))+lightingIntensity/8.;
    
    
    
}