import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'


class Model {
    constructor (obj) {
        // console.log(obj)
        console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.isActive = false

        this.color1 = obj.color1
        this.color2 = obj.color2
        this.background = obj.background

        this.loader = new GLTFLoader()
        this.DRACOLoader = new DRACOLoader()
        this.DRACOLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.DRACOLoader)

        this.init()
    }

    init(){
        this.loader.load(this.file, (response) => {
          
            /*-------------------------------
            Original Mesh
            -------------------------------*/
            this.mesh = response.scene.children[0]

            /*-------------------------------
            Material Mesh
            -------------------------------*/
            this.material = new THREE.MeshBasicMaterial({
                color: '#2ed3a3',
                wireframe: true               
            })
            this.mesh.material = this.material

            /*-------------------------------
            Geometry Mesh
            -------------------------------*/
            this.geometry = this.mesh.geometry
            //console.log(this.geometry)

            /*-------------------------------
            Particles Material
            -------------------------------*/
            // this.particlesMaterial = new THREE.PointsMaterial({
            //     color: '#2ed3a3',
            //     size: 0.02
            // })
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor1: { value: new THREE.Color(this.color1)},
                    uColor2: { value: new THREE.Color(this.color2)},
                    uTime: { value: 0 },
                    uScale: { value: 0 }
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })

            /*-------------------------------
            Particles Geometry
            -------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 20000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlePosition = new Float32Array(numParticles * 3)
            const particlesRamdomness = new Float32Array(numParticles * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlePosition.set ([
                    newPosition.x, // 0 - 3
                    newPosition.y, // 1 - 4
                    newPosition.z  // 2 - 5
                ], i * 3)

                particlesRamdomness.set([
                    Math.random() * 2 - 1, // -1 <> 1
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ], i * 3)
            }  

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePosition, 3))
            this.particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(particlesRamdomness, 3))



            console.log(this.particlesGeometry)
            
            /*-------------------------------
            Particles
            -------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
            
           /*-------------------------------
            Place On Load
            -------------------------------*/
            if (this.placeOnLoad) {
                this.add()
            }
        })
    }

    add() {
        this.scene.add(this.particles)
        
        gsap.to(this.particlesMaterial.uniforms.uScale,{
            value: 1,
            duration: .8,
            delay: .3,
            ease: 'power3.out'
        })

       if (!this.isActive) {
            gsap.fromTo(this.particles.rotation, {
                y: Math.PI
            }, {
                y: 0,
                duration: .8,
                ease: 'power3.out',
        })

            gsap.to('body', {
                background: this.background,
                duration: .8                
            })
       }
       
       this.isActive = true

    }

    remove() {
        

        gsap.to(this.particlesMaterial.uniforms.uScale,{
            value: 0,
            duration: .8,
            ease: 'power3.out',
            onComplete: () => {
                this.scene.remove(this.particles)
                this.isActive = false
            }
        })

        gsap.to(this.particles.rotation, {
            y: Math.PI,
            duration: .8,
            ease: 'power3.out'
        })
    }

}
export default Model