
import './App.css';
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { Html, Scroll, useScroll, ScrollControls, Plane, TorusKnot, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState, useMemo} from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Agency from './img/agency.jpg'
import Nvidia from './img/Nvidia.jpg'
import worldWeb from './img/worldWeb.jpg'
import carWeb from './img/carWeb.jpg'
import loading from './img/loading.jpg'

function BackGrid() {
  const { scene } = useThree();
  const scroll = useScroll()
  const floorRef = useRef()
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0, 0.05);
  }, [scene]);

  useFrame(() => (floorRef.current.position.y = scroll.offset * 6))
  return (
    <group ref={floorRef}>
    <Plane 
      position={[0, -2, -8]}
      rotation={[Math.PI / 2, 0, 0]}
      args={[80, 80, 128, 128]}
    >
      <meshStandardMaterial color="#ea5455" wireframe side={THREE.DoubleSide} />
    </Plane>
    </group>
  );
}

const Grid = () => {
  const scroll = useScroll()
  const pay = useLoader(THREE.TextureLoader, Agency)
  const gpu = useLoader(THREE.TextureLoader, Nvidia)
  const WW = useLoader(THREE.TextureLoader, worldWeb)
  const CW = useLoader(THREE.TextureLoader, carWeb)
  const load = useLoader(THREE.TextureLoader, loading)
  const { viewport } = useThree()
  const gridRef = useRef()
  useFrame(() => (gridRef.current.position.y = scroll.offset * 6))
  return(
    <group ref={gridRef} scale={(viewport.width / 5)}>
      {/* nvidia */}
      <Plane args={[1.4,1]} position={[-1, -3, 0]} onClick={e => window.open('https://nvidia-gpus.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={gpu} toneMapped={false} />
      </Plane>
      {/* payment */}
      <Plane args={[1.4,1]} position={[1, -3, 0]} onClick={e => window.open('https://retro-agency.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={pay} toneMapped={false} />
      </Plane>
      {/* world web */}
      <Plane args={[1.4,1]} position={[1, -5, 0]} onClick={e => window.open('https://world-web.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={WW} toneMapped={false} />
      </Plane>
      {/* Car web */}
      <Plane args={[1.4,1]} position={[-1, -5, 0]} onClick={e => window.open('https://car-show.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={CW} toneMapped={false} />
      </Plane>
      {/* loading web */}
      <Plane args={[1.4,1]} position={[0, -4, 0]} onClick={e => window.open('https://webwithintro.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={load} toneMapped={false} />
      </Plane>

    </group>
  )
}

function Swarm({ count, mouse }) {
  const mesh = useRef()
  const light = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const dummy = useMemo(() => new THREE.Object3D(), [])
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  // The innards of this hook will run every frame
  useFrame(state => {
    // Makes the light follow the mouse
    // light.current.position.set(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (mouse.current[0] - particle.mx) * 0.01
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s / 3, s / 3, s / 3)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <pointLight ref={light} distance={40} intensity={4} color="red" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.2, 0]} />
        <meshPhongMaterial attach="material" color="#ff6030" />
      </instancedMesh>
    </>
  )
}

const Objects = () => {
  const { viewport } = useThree()
  const scroll = useScroll()
  const objRef = useRef()

  useFrame(() => (objRef.current.position.y = scroll.offset * 6,objRef.current.rotation.z += 0.02))
  return(
    <group scale={(viewport.width / 8)}>
    <group ref={objRef}>
    <TorusKnot scale={0.2} position={[0, 0, -3]}>
    <meshStandardMaterial color={'#55080E'} />
    </TorusKnot>
    </group>
    </group>
  )
}

const Drone = () => {
  const gltf = useLoader(GLTFLoader, '/scene.gltf')
  const droneRef = useRef()
  const { viewport } = useThree()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    droneRef.current.position.y = (2 + Math.sin(t)) / 5
  })
  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 12
    const y = (mouse.y * viewport.height) / 8
    droneRef.current.rotation.set(x, y, 0)
    droneRef.current.rotation.set(y, x, 0)
  })
  return (
    <group rotation={[0, Math.PI, 0]} position={[0, -1, 0.5]}>
    <group ref={droneRef}>
      <primitive object={gltf.scene} scale={0.3} />
    </group>
    </group>

  )
}

function Rig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()
  return useFrame(() => camera.position.lerp(vec.set(mouse.x * 0.9, mouse.y * 0.9, camera.position.z), 0.02))
 
}

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const [hovered, hover] = useState(false)
  const mouse = useRef([0, 0])
  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])
  return (
    <div className="App">
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 0, 2], zoom: 1 }}
      >
        <pointLight position={[0, 1, 4]} intensity={0.1} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[1, 1, 1]}
          penumbra={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={<Html center>loading..</Html>}>
          <ScrollControls pages={3.5}>
          <Objects />
          <Drone />
          <Grid mouse={mouse} hover={hover} />
          <BackGrid position={[0, -2, 0]}/>
          <Scroll html style={{ width: '100%' }}>
        <h1 style={{ position: 'absolute',color: "aliceblue", top: `100vh`, right: '35vw', fontSize: '5vw',letterSpacing: '3px', transform: `translate3d(0,-100%,0)` }}>
          My<br />
          Portfolio
        </h1>
        <h1 style={{ position: 'absolute', top: '150vh', left: '10vw', fontSize: '3vw',color: "#059C9F" }}>All are front-end projects and they mostly are done with React and libraries like Gsap, Three.js, R3F and like so.</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", right: '32vw', color: "aliceblue"}}>This is prototype<br/>Thats why it's ugly</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", left: '10vw', color: "aliceblue" }}>Click on Photos <rb/>to see more about my websites</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", left: '68vw', color: "aliceblue" }}>Created with most trending <br/>web feature, 3D</h1>
        <h1 style={{ position: 'absolute', top: '330vh', width:"25vw", left: '50vw', color: "aliceblue" }}>Mail: <br/>achikoogorgadze@gmail.com</h1>
      </Scroll>
          </ScrollControls>
        </Suspense>
        <Swarm count={isMobile ? 5000 : 10000} mouse={mouse} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={1024}
          />
        </EffectComposer>
        <Rig />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

export default App;
