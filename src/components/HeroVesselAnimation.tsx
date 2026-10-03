"use client";

import React, { useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Suppress benign internal Three.js r183+ Clock deprecation notice emitted by React Three Fiber
if (typeof window !== "undefined") {
  const _warn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Clock: This module has been deprecated")) {
      return;
    }
    _warn.apply(console, args);
  };
}

// ---------------------------------------------------------------------------
// Error Boundary Fallback for WebGL Failures
// ---------------------------------------------------------------------------
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGL Canvas encountered an error, rendering fallback:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// High-End Grayscale Static Fallback (for older devices / missing WebGL)
// ---------------------------------------------------------------------------
function StaticFallback() {
  return (
    <div
      className="absolute inset-0 -z-10 w-full h-full bg-black flex items-center justify-center overflow-hidden pointer-events-none"
      aria-label="Vessel Animation Fallback"
    >
      {/* Deep grayscale radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(40,40,40,0.5)_0%,#000000_85%)]" />
      {/* Ambient microscopic matrix grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[28px_28px]" />
      {/* Concentric vessel lumen depth rings */}
      <div className="absolute w-160 h-160 rounded-full border border-white/5 opacity-40 blur-[1px]" />
      <div className="absolute w-104 h-104 rounded-full border border-white/10 opacity-30" />
      <div className="absolute w-56 h-56 rounded-full border border-white/15 opacity-20" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Procedural Organic Noise Texture Generator (Seamless Fibrous/Cellular Map)
// ---------------------------------------------------------------------------
function createOrganicNoiseTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Generate multi-octave cellular endothelial tissue noise with longitudinal fibers
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Angular u and longitudinal v coordinates
      const u = (x / width) * Math.PI * 2;
      const v = (y / height) * Math.PI * 2;

      // Longitudinal tissue folds stretched along the vessel lumen
      const fold1 = Math.sin(u * 8 + Math.sin(v * 3) * 1.6);
      const fold2 = Math.sin(u * 16 + v * 2) * 0.45;
      const fold3 = Math.cos(u * 28 + Math.sin(v * 6) * 2.0) * 0.3;
      const fold4 = Math.sin(v * 12 + Math.cos(u * 10) * 1.5) * 0.25;

      // Microscopic cellular pits
      const microPits = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.2;

      let val = (fold1 + fold2 + fold3 + fold4 + microPits + 1.4) / 2.8;
      // High-contrast S-curve to create deep black valleys and stark white ridges
      val = Math.pow(Math.max(0, Math.min(1, val)), 1.75);

      const intensity = Math.floor(val * 255);
      const idx = (y * width + x) * 4;
      data[idx] = intensity;     // R
      data[idx + 1] = intensity; // G
      data[idx + 2] = intensity; // B
      data[idx + 3] = 255;       // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Repeat around circumference and stretch along the tunnel length for fibrous look
  texture.repeat.set(10, 2);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Internal Vessel Tunnel with Vertex Displacement (Organic Bulging & Bumps)
// ---------------------------------------------------------------------------
interface VesselTunnelProps {
  curve: THREE.CatmullRomCurve3;
  tubeRadius: number;
}

function VesselTunnel({ curve, tubeRadius }: VesselTunnelProps) {
  const noiseTexture = useMemo(() => createOrganicNoiseTexture(), []);

  const tubeGeometry = useMemo(() => {
    // 220 tubular segments along curve, 36 radial segments
    const geom = new THREE.TubeGeometry(curve, 220, tubeRadius, 36, true);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();

    // Displace vertices with multi-frequency 3D sinusoidal noise to create organic bulging and contracting
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);

      // Low-frequency organic wave modulation causing uneven wall diameter
      const w1 = Math.sin(v.x * 0.12 + v.z * 0.08) * Math.cos(v.y * 0.14);
      const w2 = Math.cos(v.z * 0.18 + v.x * 0.15) * 0.55;
      const w3 = Math.sin(v.y * 0.28 + v.z * 0.22) * 0.3;
      const disp = (w1 + w2 + w3) * 0.52;

      // Perturb coordinates radially and organically
      v.x += Math.sin(v.z * 0.25) * disp * 0.75;
      v.y += Math.cos(v.x * 0.25) * disp * 0.75;
      v.z += Math.sin(v.y * 0.25) * disp * 0.5;

      pos.setXYZ(i, v.x, v.y, v.z);
    }

    geom.computeVertexNormals();
    pos.needsUpdate = true;
    return geom;
  }, [curve, tubeRadius]);

  return (
    <mesh geometry={tubeGeometry}>
      {/* High-contrast organic electron-microscope vessel wall */}
      <meshStandardMaterial
        color="#ffffff"
        map={noiseTexture}
        bumpMap={noiseTexture}
        bumpScale={1.6}
        roughness={0.7}
        metalness={0.1}
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Instanced Blood Cells (Erythrocyte biconcave discs floating in plasma)
// ---------------------------------------------------------------------------
interface BloodCellsProps {
  curve: THREE.CatmullRomCurve3;
  tubeRadius: number;
  count?: number;
}

interface CellData {
  t: number;
  angle: number;
  radialDist: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  driftSpeed: number;
}

// Deterministic pseudo-random number generator for reproducible, pure generation
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function initCellsData(count: number, tubeRadius: number): CellData[] {
  const list: CellData[] = [];
  for (let i = 0; i < count; i++) {
    const s = i * 11 + 1;
    list.push({
      t: pseudoRandom(s),
      angle: pseudoRandom(s + 1) * Math.PI * 2,
      // Maintain distance within vessel lumen (0.4 to 72% of radius)
      radialDist: 0.4 + pseudoRandom(s + 2) * (tubeRadius * 0.72),
      scale: 0.75 + pseudoRandom(s + 3) * 0.45,
      rotX: pseudoRandom(s + 4) * Math.PI * 2,
      rotY: pseudoRandom(s + 5) * Math.PI * 2,
      rotZ: pseudoRandom(s + 6) * Math.PI * 2,
      // Gentle, fluid tumbling speeds (slowed down for majestic fluid suspension)
      speedX: (pseudoRandom(s + 7) - 0.5) * 0.32,
      speedY: (pseudoRandom(s + 8) - 0.5) * 0.35,
      speedZ: (pseudoRandom(s + 9) - 0.5) * 0.30,
      // Slow forward drift in plasma
      driftSpeed: 0.0016 + pseudoRandom(s + 10) * 0.0022,
    });
  }
  return list;
}

function BloodCells({ curve, tubeRadius, count = 380 }: BloodCellsProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const upVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const normalVec = useMemo(() => new THREE.Vector3(), []);
  const binormalVec = useMemo(() => new THREE.Vector3(), []);

  // Initialize simulation buffer directly via useRef argument for compiler purity
  const cellsRef = useRef<CellData[]>(initCellsData(count, tubeRadius));

  // Frame update: fluid continuous cell tumbling and arc-length drift
  useFrame((_, delta) => {
    if (!instancedMeshRef.current || !cellsRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    const cells = cellsRef.current;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      // Smooth continuous tumbling without snapping or vibrating
      cell.rotX = (cell.rotX + cell.speedX * safeDelta) % (Math.PI * 2);
      cell.rotY = (cell.rotY + cell.speedY * safeDelta) % (Math.PI * 2);
      cell.rotZ = (cell.rotZ + cell.speedZ * safeDelta) % (Math.PI * 2);

      // Microscopic forward drift along the curve using arc-length parameterization
      cell.t = (cell.t + cell.driftSpeed * safeDelta) % 1;

      // Arc-length position and continuous tangent vector
      const centerPoint = curve.getPointAt(cell.t);
      const tangent = curve.getTangentAt(cell.t);

      // Continuous cross-sectional basis vectors (eliminates discrete frame jumping)
      normalVec.crossVectors(tangent, upVec).normalize();
      if (normalVec.lengthSq() < 0.01) {
        normalVec.set(1, 0, 0);
      }
      binormalVec.crossVectors(tangent, normalVec).normalize();

      // Position cell smoothly within lumen cross-section
      dummy.position
        .copy(centerPoint)
        .addScaledVector(normalVec, Math.cos(cell.angle) * cell.radialDist)
        .addScaledVector(binormalVec, Math.sin(cell.angle) * cell.radialDist);

      dummy.rotation.set(cell.rotX, cell.rotY, cell.rotZ);

      // Biconcave erythrocyte disc: flattened along one axis
      dummy.scale.set(cell.scale, cell.scale * 0.36, cell.scale);
      dummy.updateMatrix();

      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      {/* Optimized 16x16 sphere geometry for perfect 60 FPS performance */}
      <sphereGeometry args={[0.34, 16, 16]} />
      {/* High-fidelity material with flatShading={false} for smooth GPU normal interpolation */}
      <meshStandardMaterial
        color="#ffffff"
        emissive="#555555"
        emissiveIntensity={0.35}
        roughness={0.25}
        metalness={0.15}
        flatShading={false}
      />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Camera Rig & Angioscopic Headlight
// ---------------------------------------------------------------------------
interface CameraRigProps {
  curve: THREE.CatmullRomCurve3;
  speed?: number;
}

function CameraRig({ curve, speed = 0.010 }: CameraRigProps) {
  const tRef = useRef(0);
  const headlightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    // Smooth infinite loop along curve [0 -> 1]
    tRef.current = (tRef.current + safeDelta * speed) % 1;
    const t = tRef.current;

    // Arc-length parameterization via getPointAt for uniform, constant flying speed
    const currentPos = curve.getPointAt(t);
    // Uniform lookAt target calculation along arc-length
    const lookAtT = (t + 0.01) % 1;
    const lookTarget = curve.getPointAt(lookAtT);

    state.camera.position.copy(currentPos);
    state.camera.lookAt(lookTarget);

    if (headlightRef.current) {
      headlightRef.current.position.copy(currentPos);
    }
  });

  return (
    // High-contrast electron microscope headlight casting grazing specular light on ridges
    <pointLight
      ref={headlightRef}
      color="#ffffff"
      intensity={55}
      distance={55}
      decay={1.8}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Export: HeroVesselAnimation
// ---------------------------------------------------------------------------
export interface HeroVesselAnimationProps {
  className?: string;
  speed?: number;
  cellCount?: number;
}

const emptySubscribe = () => () => {};

export default function HeroVesselAnimation({
  className = "",
  speed = 0.010,
  cellCount = 380,
}: HeroVesselAnimationProps) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Smooth closed 3D looping curve (centripetal Catmull-Rom spline)
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(14, 8, 35),
      new THREE.Vector3(28, 2, 70),
      new THREE.Vector3(20, -14, 105),
      new THREE.Vector3(-8, -20, 135),
      new THREE.Vector3(-32, -10, 155),
      new THREE.Vector3(-46, 6, 130),
      new THREE.Vector3(-40, 18, 90),
      new THREE.Vector3(-22, 20, 50),
      new THREE.Vector3(-8, 10, 20),
    ];
    return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
  }, []);

  const tubeRadius = 4.2;

  const hasWebGL = useMemo(() => {
    if (!isClient || typeof window === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  }, [isClient]);

  if (!isClient || !hasWebGL) {
    return <StaticFallback />;
  }

  return (
    <div
      className={`absolute inset-0 -z-10 w-full h-full bg-black overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <WebGLErrorBoundary fallback={<StaticFallback />}>
        <Canvas
          camera={{ fov: 62, near: 0.1, far: 80 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
          }}
          dpr={[1, 2]}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        >
          {/* Strict grayscale aesthetic: deep black background */}
          <color attach="background" args={["#000000"]} />

          {/* Pure black exponential fog fading into total darkness */}
          <fogExp2 attach="fog" args={["#000000", 0.02]} />

          {/* Low global ambient light so valleys and crevices stay in deep shadow */}
          <ambientLight intensity={0.12} color="#ffffff" />
          <directionalLight position={[0, 10, 5]} intensity={0.15} color="#ffffff" />

          {/* Endless forward-flying camera rig with softened headlight */}
          <CameraRig curve={curve} speed={speed} />

          {/* Ultra-smooth, glossy dark vessel tunnel with specular reflections (no wireframe) */}
          <VesselTunnel curve={curve} tubeRadius={tubeRadius} />

          {/* High-resolution smooth instanced erythrocytes (32x32 segments) */}
          <BloodCells curve={curve} tubeRadius={tubeRadius} count={cellCount} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
