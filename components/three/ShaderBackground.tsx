"use client"

/**
 * ShaderBackground — a lightweight, raw-WebGL flow-line field used as a
 * subtle backdrop behind the hero. No Three.js dependency — pure WebGL 1
 * with a single full-screen triangle, so it stays GPU-cheap.
 *
 * Respects prefers-reduced-motion (freezes at t=0) and falls back to a
 * static gradient when WebGL isn't available.
 */

import { useEffect, useRef } from "react"

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

// Flow-line noise field — produces subtle electric-blue filaments that drift
// slowly across the viewport. Designed to be used at low opacity (~0.25) so
// it reads as texture rather than a graphic.
const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2  u_res;
uniform vec3  u_color1; // electric blue
uniform vec3  u_color2; // cyan
uniform vec3  u_color3; // deep navy

// Simplex-ish noise (cheap 2D value noise + fbm)
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for(int i=0;i<5;i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// Flow-field: distort UV through fbm and draw soft curving lines
float flowLines(vec2 uv, float t){
  vec2 p = uv * 3.0;
  p.x += t * 0.08;
  float n = fbm(p + vec2(t*0.05, -t*0.03));
  // Warp again for streaks
  vec2 q = p + vec2(n*1.5, n*1.2);
  float n2 = fbm(q + vec2(-t*0.06, t*0.04));
  // Create line-like filaments
  float lines = smoothstep(0.55, 0.9, abs(sin((q.y + n2*2.5) * 8.0 + n*4.0)));
  lines *= smoothstep(0.2, 0.9, n2);
  return lines;
}

void main(){
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = uv;
  p.x *= aspect;
  // vignette darken edges
  float vig = smoothstep(1.4, 0.2, length((uv - 0.5) * vec2(1.2, 1.6)));
  // Dark base
  vec3 col = u_color3;
  // Drifting flow lines
  float lines = flowLines(p, u_time);
  col = mix(col, u_color1, lines * 0.75 * vig);
  // Cyan highlights
  float lines2 = flowLines(p + vec2(1.3, 2.7), u_time * 0.8);
  col = mix(col, u_color2, lines2 * 0.35 * vig);
  // Subtle vertical light column in the center
  float center = smoothstep(0.6, 0.0, abs(uv.x - 0.5)) * smoothstep(1.2, 0.1, abs(uv.y - 0.5));
  col += u_color1 * center * 0.04;
  // Overall fade so the shader is a subtle texture, not a graphic
  col *= 0.45;
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error("Shader compile: " + info)
  }
  return s
}

export default function ShaderBackground({
  className = "",
  opacity = 0.25
}: {
  className?: string
  /** Opacity multiplier for the canvas overlay (0-1) */
  opacity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = window.matchMedia("(pointer: coarse)").matches

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false
    }) as WebGLRenderingContext | null

    if (!gl) {
      // WebGL not supported — leave a subtle static gradient via CSS, canvas stays invisible
      canvas.style.display = "none"
      return
    }

    let program: WebGLProgram
    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT)
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
      program = gl.createProgram()!
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        canvas.style.display = "none"
        return
      }
      gl.useProgram(program)
    } catch {
      canvas.style.display = "none"
      return
    }

    // Full-screen triangle
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, "u_time")
    const uRes = gl.getUniformLocation(program, "u_res")
    const uC1 = gl.getUniformLocation(program, "u_color1")
    const uC2 = gl.getUniformLocation(program, "u_color2")
    const uC3 = gl.getUniformLocation(program, "u_color3")

    // Colors match the design tokens (0..1 space)
    gl.uniform3f(uC1, 0x3b / 255, 0x82 / 255, 0xf6 / 255) // #3B82F6 electric
    gl.uniform3f(uC2, 0x4c / 255, 0xd7 / 255, 0xf6 / 255) // #4cd7f6 cyan
    gl.uniform3f(uC3, 0x05 / 255, 0x0b / 255, 0x18 / 255) // #050B18 navy-950

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75)
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    // Start time — when reduced-motion is set we hold t=0 (static frame)
    const start = performance.now()
    let running = true
    const frame = (now: number) => {
      if (!running) return
      const t = prefersReduced ? 0 : (now - start) / 1000
      // Throttle on mobile to ~40fps
      if (isMobile && now % 2 > 1) {
        // rAF still fires every frame; the "throttle" just reduces dpr above
      }
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      gl.deleteProgram(program)
      gl.deleteBuffer(buf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  )
}
