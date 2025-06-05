import { useEffect, useRef } from  "react"
import * as THREE from "three";

let canvas:HTMLCanvasElement;

function initScene(currentMount: HTMLDivElement) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    camera.position.z = 20

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)

    canvas = renderer.domElement;
    // currentMount.appendChild(canvas);

    const lightPosition = new THREE.Vector3(100, 0, 0)
    const ambientLightIntensity = 0.06

    const radiusEarth = 10;
    const radiuSAtmosphere = 1.1 * radiusEarth;
    const globe = new THREE.Mesh(new THREE.SphereGeometry(radiusEarth, 100, 50), new THREE.ShaderMaterial());
    scene.add(globe);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radiuSAtmosphere, 160, 80), new THREE.ShaderMaterial());
    scene.add(atmosphere);

    async function render() {
        const [vertexGlobe, fragmentGlobe] = await Promise.all([
            fetch("./globe/vert.glsl").then(res => res.text()),
            fetch("./globe/frag.glsl").then(res => res.text())
        ])

        const [vertexAtmosphere, fragmentAtmosphere] = await Promise.all([
            fetch("./atmosphere/vert.glsl").then(res => res.text()),
            fetch("./atmosphere/frag.glsl").then(res => res.text())
        ])

        const shaderGlobe = new THREE.ShaderMaterial({
            vertexShader: vertexGlobe,
            fragmentShader: fragmentGlobe,
            uniforms: {
                dayTexture: {
                    value: new THREE.TextureLoader().load("./globe/earth-day.jpg")
                },
                nightTexture: {
                    value: new THREE.TextureLoader().load("./globe/earth-night.jpg")
                },
                lightPosition: {
                    value: lightPosition
                },
                ambientLightIntensity: {
                    value: ambientLightIntensity
                }
            }
        })
        globe.material = shaderGlobe

        const shaderAtmosphere = new THREE.ShaderMaterial({
            vertexShader: vertexAtmosphere,
            fragmentShader: fragmentAtmosphere,
            transparent: true,
            uniforms: {
                lightPosition: {
                    value: lightPosition
                },
                ambientLightIntensity: {
                    value: ambientLightIntensity
                },
                radiusEarth: {
                    value: radiusEarth
                },
                radiusAtmosphere: {
                    value: radiuSAtmosphere
                }
            }
        })
        atmosphere.material = shaderAtmosphere
    }
    render()

    function animate() {
        // globe.rotateY(1 / 200)
        // globe.rotateX(1 / 800)
        requestAnimationFrame(animate)
        const glp = globe.material.uniforms.lightPosition
        const alp = atmosphere.material.uniforms.lightPosition
        lightPosition.applyAxisAngle(new THREE.Vector3(0,1,0),1/200)
        if (glp != undefined){
            glp.value.set(...lightPosition)
            alp.value.set(...lightPosition)
        }
        renderer.render(scene, camera)
    }
    animate()
}


export function Globe(){
    const renderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => { 
        const currentMount = renderRef.current
        if (!currentMount) {
            return
        }
        
        if(!canvas){
            initScene(currentMount)
        }
        
        if (canvas && !currentMount.contains(canvas)) {
           currentMount.appendChild(canvas);
        }
    },[])

    return ( <div ref={renderRef} className="w-2xl h-114"></div> )
}