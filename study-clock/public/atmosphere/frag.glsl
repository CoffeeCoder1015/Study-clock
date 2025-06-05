varying vec2 vertexUV;
varying vec3 vNormal;

uniform vec3 lightPosition;
uniform float ambientLightIntensity;
uniform float radiusEarth;
uniform float radiusAtmosphere;

#define rAtmSqr radiusAtmosphere*radiusAtmosphere

#define PI 3.1415926535897932384626433832795

float gammaCorrection(float x){
    return x*x - 0.25;
}

float sigmoid(float x){
    return 1. / (1. + exp(-x));
}

float channelColoration(float dist,float cosTheta, float specificConst){
    float thetaSqr = pow( acos(cosTheta),2. );
    float mappedDistance = 0.5*dist*exp(-2.*cosTheta)-dist*(1.-exp(-2.*cosTheta));
    float expDec = exp(-specificConst*mappedDistance*thetaSqr);
    return gammaCorrection(sigmoid(
        expDec*pow(cosTheta,2.)
    ));
}


vec3 rrgb(vec3 pos){
    vec3 F = lightPosition-pos;
    vec3 unit = normalize(F);
    float pdotu = dot(pos,unit) + 2.;
    float xSqred = dot(pos,pos);
    float cosTheta = pdotu / sqrt(xSqred);

    float sqrr = pow(pdotu,2.) - xSqred + rAtmSqr;
    float dist = -pdotu + sqrt(abs(sqrr));
    

    vec3 rawColors = vec3(
        channelColoration(dist,cosTheta,0.21),
        channelColoration(dist,cosTheta,0.43),
        channelColoration(dist,cosTheta,1.0)
    );
    
    float totalContribution = rawColors.x+rawColors.y+rawColors.z;
    float exposureCoeff = 3.*cosTheta/totalContribution;
    vec3 finalColor = rawColors*exposureCoeff;
    return finalColor;
}

void main(){
    // reverse halo effect
    float bloomintensity = dot(vNormal,normalize( cameraPosition ));
    float intensity = pow(bloomintensity,4.);
    
    // general lighting
    vec3 lightDirection = lightPosition-vNormal*radiusAtmosphere;
    float lightingIntensity = dot(normalize(lightDirection), vNormal);
    
    // handroll rayleigh
    vec3 lightadj = rrgb(radiusEarth*vNormal);
    gl_FragColor = vec4(lightadj,0.4*intensity)+0.1*lightingIntensity;
}