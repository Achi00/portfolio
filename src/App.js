
import './App.css';
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { Html, Scroll, useScroll, ScrollControls, Plane } from "@react-three/drei";
import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState, useCallback} from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Payment from './img/payment.jpg'
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
  const pay = useLoader(THREE.TextureLoader, Payment)
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
      <Plane position={[-1, -3, 0]} onClick={e => window.open('https://nvidia-gpus.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={gpu} toneMapped={false} />
      </Plane>
      {/* payment */}
      <Plane position={[1, -3, 0]} onClick={e => window.open('https://pay-online.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={pay} toneMapped={false} />
      </Plane>
      {/* world web */}
      <Plane position={[1, -5, 0]} onClick={e => window.open('https://world-web.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={WW} toneMapped={false} />
      </Plane>
      {/* Car web */}
      <Plane position={[-1, -5, 0]} onClick={e => window.open('https://car-show.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={CW} toneMapped={false} />
      </Plane>
      {/* loading web */}
      <Plane position={[0, -4, 0]} onClick={e => window.open('https://webwithintro.netlify.app/', '_blank')}>
      <meshBasicMaterial attach="material" map={load} toneMapped={false} />
      </Plane>

    </group>
  )
}


function App() {
  
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
          <Grid mouse={mouse} hover={hover} />
          <BackGrid position={[0, -2, 0]}/>
          <Scroll html style={{ width: '100%' }}>
        <h1 style={{ position: 'absolute',color: "aliceblue", top: `100vh`, right: '35vw', fontSize: '5vw',letterSpacing: '3px', transform: `translate3d(0,-100%,0)` }}>
          My<br />
          Portfolio
        </h1>
        <h1 style={{ position: 'absolute', top: '180vh', left: '10vw', fontSize: '5vw',color: "#059C9F" }}>All are front-end projects and they mostly are done with React and libraries like Gsap, Three.js, R3F and like so.</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", right: '32vw', color: "aliceblue"}}>Created with creativity<br/>Because It's most important about design</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", left: '10vw', color: "aliceblue" }}>Click on Photos <rb/>to see more about my websites</h1>
        <h1 style={{ position: 'absolute', top: '290vh', width:"25vw", left: '68vw', color: "aliceblue" }}>Created with most trending <br/>web feature, 3D</h1>
        <h1 style={{ position: 'absolute', top: '330vh', width:"25vw", left: '50vw', color: "aliceblue" }}>Mail: <br/>achikoogorgadze@gmail.com</h1>
      </Scroll>
          </ScrollControls>
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={1024}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default App;
