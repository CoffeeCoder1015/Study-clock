import { useEffect, useRef } from  "react"
import * as THREE from "three";

export function Globe(){
    const renderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const currentMount = renderRef.current
        if (!currentMount){
            return
        }
        
        const scene  = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
        camera.position.z = 20
        
        const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true})
        renderer.setClearColor(0x000000, 0)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(currentMount.clientWidth,currentMount.clientHeight)
        currentMount.appendChild(renderer.domElement)

        const geometry = new THREE.SphereGeometry(10,50,50);
        const material = new THREE.MeshBasicMaterial({ map:new THREE.TextureLoader().load("./earth-night.jpg") });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.setRotationFromEuler(new THREE.Euler(0,3,0))
        scene.add(sphere);

        function animate(){
            requestAnimationFrame(animate)
            renderer.render(scene,camera)
        }
        animate()

        return () => {
            currentMount.removeChild(renderer.domElement)
        }
    },[])

    return ( <div ref={renderRef} className="w-2xl h-114"></div> )
}