import { useEffect, useRef } from  "react"
import * as THREE from "three";

export function Globe(){
    const renderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => { 
        const currentMount = renderRef.current
        if (!currentMount) {
            return
        }

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
        camera.position.z = 20

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
        currentMount.appendChild(renderer.domElement)
        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.position.set(10, 0, 0);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        
        const geometry = new THREE.SphereGeometry(10, 50, 50);
        const material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("./globe/earth-night.jpg") });
        const sphere = new THREE.Mesh(geometry, new THREE.ShaderMaterial());

        async function render() {
            const [vertex, fragment] = await Promise.all([
                fetch("./globe/vert.glsl").then(res => res.text()),
                fetch("./globe/frag.glsl").then(res => res.text())
            ])

            const shader = new THREE.ShaderMaterial({
                vertexShader: vertex,
                fragmentShader: fragment,
                uniforms: {
                    dayTexture: {
                        value: new THREE.TextureLoader().load("./globe/earth-day.jpg")
                    },
                    nightTexture: {
                        value: new THREE.TextureLoader().load("./globe/earth-night.jpg")
                    },
                    lightPosition: {
                        value: new THREE.Vector3(100, 0, 0)
                    },
                    ambientLightIntensity: {
                        value: 0.06
                    }
                }
            })
            sphere.material = shader
            scene.add(sphere);
        }
        render()

        function animate() {
            sphere.rotateY(1/200)
            sphere.rotateX(1/800)
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        animate()

        return () => {
            currentMount.removeChild(renderer.domElement)
        }
    },[])

    return ( <div ref={renderRef} className="w-2xl h-114"></div> )
}