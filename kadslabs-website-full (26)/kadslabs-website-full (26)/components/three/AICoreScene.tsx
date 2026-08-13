"use client"

/**
 * AICoreScene — the cinematic 3D AI Core built with React Three Fiber.
 *
 * - Glowing core sphere with custom shader (pulsing + fresnel rim + surface breathing)
 * - Orbiting energy rings (three tilted toruses)
 * - Particle swarm (additive points) that gently rotates and twinkles
 * - Octahedron wireframe cage around the core for tech-edge feel
 * - Mouse-reactive camera parallax (pointer → slight orbit)
 * - Scroll-driven camera dolly: zooms out and tilts as user scrolls past hero
 * - Respects prefers-reduced-motion
 *
 * Performance:
 *   - Points (additive blending) for 420 particles → one draw call
 *   - DPR capped at 1.5 desktop / 1.25 mobile
 *   - No shadows, no post-processing
 *   - Single custom fragment shader on the core
 */

import { useRef, useMemo, Suspense, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "@/app/components/ThemeProvider"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

/* ------------------------------------------------------------------ */
/*  Core shader (fresnel + pulse + moving energy bands)               */
/* ------------------------------------------------------------------ */
const coreVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
uniform float uTime;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vPosition = position;
  vViewDir = normalize(-mv.xyz);
  vec3 displaced = position + normal * sin(uTime * 2.0 + position.y * 4.0) * 0.015;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

const coreFragment = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorRim;
uniform vec3 uColorDeep;
void main() {
  float fres = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
  float facing = max(dot(vNormal, vViewDir), 0.0);
  float radial = length(vPosition) * 0.9;
  float pulse = 0.9 + sin(uTime * 2.0) * 0.1;
  vec3 deep = uColorDeep * facing;
  vec3 mid  = uColorCore * (0.55 + 0.45 * sin(uTime*0.7 + vPosition.y*3.0)) * pulse;
  vec3 rim  = uColorRim * fres * 1.8;
  float bands = smoothstep(0.3, 0.7, sin(vPosition.y*8.0 + uTime*1.5));
  vec3 col = deep + mid + rim;
  col += uColorRim * bands * 0.25 * fres;
  col += uColorCore * pow(1.0 - radial, 2.5) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`

/* ------------------------------------------------------------------ */
/*  Core                                                              */
/* ------------------------------------------------------------------ */
function Core({ isDark }: { isDark: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const core = useMemo(() => {
    const cDeep = isDark ? new THREE.Color("#0B1729") : new THREE.Color("#90BCFF")
    const cCore = new THREE.Color("#1E6BFF")
    const cRim  = new THREE.Color("#33B5FF")
    return { cDeep, cCore, cRim }
  }, [isDark])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorCore: { value: core.cCore },
    uColorRim:  { value: core.cRim },
    uColorDeep: { value: core.cDeep },
  }), [core])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh>
      <icosahedronGeometry args={[1.1, 5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={coreVertex}
        fragmentShader={coreFragment}
        uniforms={uniforms}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Energy ring                                                       */
/* ------------------------------------------------------------------ */
function EnergyRing({ radius, tilt, speed, color, thickness = 0.008, opacity = 0.7 }:
  { radius: number; tilt: [number, number, number]; speed: number; color: string; thickness?: number; opacity?: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, thickness, 16, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Orbiting particles (Points, additive blending)                    */
/* ------------------------------------------------------------------ */
function OrbitParticles({ count = 420, radius = 2.9, isDark }:
  { count?: number; radius?: number; isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const buf = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const baseColors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const cBlue = new THREE.Color("#33B5FF")
    const cWhite = new THREE.Color("#FFFFFF")
    const cPurple = new THREE.Color("#A78BFA")
    for (let i = 0; i < count; i++) {
      const shell = i % 3
      const r = radius + (shell - 1) * 0.35 + (Math.random() - 0.5) * 0.2
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI * 0.7
      positions[i*3]   = r * Math.cos(theta) * Math.cos(phi)
      positions[i*3+1] = r * Math.sin(phi)
      positions[i*3+2] = r * Math.sin(theta) * Math.cos(phi)
      const pick = Math.random()
      const c = pick < 0.7 ? cBlue : pick < 0.9 ? cWhite : cPurple
      baseColors[i*3] = c.r; baseColors[i*3+1] = c.g; baseColors[i*3+2] = c.b
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, colors, baseColors, phases }
  }, [count, radius])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const col = (pointsRef.current.geometry.attributes.color as THREE.BufferAttribute)
    for (let i = 0; i < count; i++) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + buf.phases[i])
      col.array[i*3+1] = buf.baseColors[i*3+1] * (0.7 + 0.3 * twinkle)
    }
    col.needsUpdate = true
    pointsRef.current.rotation.y = t * 0.1
    pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.15
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buf.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[buf.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={isDark ? 0.9 : 0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/*  Wireframe cage                                                    */
/* ------------------------------------------------------------------ */
function WireframeCage() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * 0.2
    ref.current.rotation.y = clock.getElapsedTime() * 0.25
  })
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1.55, 1]} />
      <meshBasicMaterial color="#33B5FF" wireframe transparent opacity={0.18} toneMapped={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Camera rig: mouse parallax + scroll dolly                         */
/* ------------------------------------------------------------------ */
function CameraRig({ mouseRef, scrollRef, reduced }:
  { mouseRef: React.MutableRefObject<{x:number;y:number}>; scrollRef: React.MutableRefObject<number>; reduced: boolean }) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const desired = useMemo(() => new THREE.Vector3(0, 0, 4.6), [])

  useFrame(() => {
    if (reduced) return
    const sp = scrollRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    const baseZ = 4.6 + sp * 2.6
    const baseY = sp * 0.8
    desired.set(mx * 0.4, my * 0.25 + baseY, baseZ)
    camera.position.lerp(desired, 0.06)
    camera.lookAt(target)
  })
  return null
}

/* ------------------------------------------------------------------ */
/*  Public export                                                     */
/* ------------------------------------------------------------------ */
export default function AICoreScene() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const reduced = useReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (isTouch || reduced) return

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => {
      const hero = document.getElementById("home")
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const v = -rect.top / Math.max(rect.height, 1)
      scrollRef.current = Math.max(0, Math.min(1, v))
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [reduced])

  const dpr = typeof window !== "undefined"
    ? Math.min(window.devicePixelRatio || 1, window.matchMedia("(pointer: coarse)").matches ? 1.25 : 1.5)
    : 1.5

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.6], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 3]} intensity={isDark ? 1.3 : 1.9} color="#5B9AFF" />
      <pointLight position={[-3, -2, 2]} intensity={isDark ? 0.7 : 1.1} color="#A78BFA" />

      <Suspense fallback={null}>
        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
          <Core isDark={isDark} />
        </Float>
        <WireframeCage />
        <EnergyRing radius={1.95} tilt={[1.05, 0.2, 0]}    speed={0.35}  color="#33B5FF" opacity={isDark ? 0.6 : 0.5} />
        <EnergyRing radius={2.25} tilt={[-0.8, 0.6, 0.4]}  speed={-0.25} color="#1E6BFF" thickness={0.006} opacity={isDark ? 0.45 : 0.38} />
        <EnergyRing radius={2.6}  tilt={[0.4, -0.7, 0.2]}  speed={0.18}  color="#A78BFA" thickness={0.004} opacity={isDark ? 0.45 : 0.35} />
        <OrbitParticles count={420} radius={2.9} isDark={isDark} />
        <CameraRig mouseRef={mouseRef} scrollRef={scrollRef} reduced={reduced} />
      </Suspense>
    </Canvas>
  )
}
