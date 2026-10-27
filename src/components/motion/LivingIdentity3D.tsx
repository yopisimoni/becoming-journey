'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

export interface LivingIdentity3DProps {
  currentStep?: number;
  className?: string;
  size?: number; // Size in pixels or responsive
  interactive?: boolean;
  reducedMotion?: boolean;
  onSculptureClick?: () => void;
}

/**
 * Creates a soft particle circle texture dynamically in memory.
 * Zero external asset requests, zero network calls.
 */
function createParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(244, 219, 255, 0.85)');
    gradient.addColorStop(0.5, 'rgba(196, 181, 253, 0.35)');
    gradient.addColorStop(1, 'rgba(196, 181, 253, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an organic, tapered lotus/mandala petal geometry with smooth bevels and depth.
 */
function createCurvedPetalGeometry(width: number, length: number, cupDepth: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.45, length * 0.22, width, length * 0.62, 0, length);
  shape.bezierCurveTo(-width, length * 0.62, -width * 0.45, length * 0.22, 0, 0);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.025,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.translate(0, length * 0.5, 0);

  // Deform along z-axis to cup the petal organically
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const normY = Math.max(0, Math.min(1, y / length));
    const curveZ = -cupDepth * Math.sin(normY * Math.PI) - 0.04 * (x * x);
    pos.setZ(i, pos.getZ(i) + curveZ);
  }
  geom.computeVertexNormals();
  return geom;
}

export const LivingIdentity3D: React.FC<LivingIdentity3DProps> = ({
  currentStep = 0,
  className = '',
  size,
  interactive = true,
  reducedMotion = false,
  onSculptureClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse / Pointer spring state
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const rippleRef = useRef<number>(0);
  const stepTargetRef = useRef<number>(currentStep);

  useEffect(() => {
    stepTargetRef.current = currentStep;
  }, [currentStep]);

  // Click ripple trigger
  const handleCanvasClick = useCallback(() => {
    rippleRef.current = 1.0;
    if (onSculptureClick) {
      onSculptureClick();
    }
  }, [onSculptureClick]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || size || 320;
    const height = container.clientHeight || size || 320;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Main Identity Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Root sculpture group that will be rotated and tilted
    const sculptureGroup = new THREE.Group();
    masterGroup.add(sculptureGroup);

    // -------------------------------------------------------------
    // LIGHTING: Apple-grade soft studio & iridescent backlighting
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xf5f3ff, 1.2);
    scene.add(ambientLight);

    // Warm key light (champagne amber)
    const keyLight = new THREE.DirectionalLight(0xfef3c7, 1.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Cool rim light (iridescent lavender)
    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.5);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // Top soft accent light (blush peach)
    const topLight = new THREE.DirectionalLight(0xfda4af, 1.1);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Internal Core Point Light (breathing heartbeat)
    const corePointLight = new THREE.PointLight(0xfbbf24, 2.4, 5.5);
    corePointLight.position.set(0, 0, 0);
    sculptureGroup.add(corePointLight);

    // -------------------------------------------------------------
    // CENTRAL CORE: The Luminous Seed of Awareness
    // -------------------------------------------------------------
    const coreGeometry = new THREE.SphereGeometry(0.26, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sculptureGroup.add(coreMesh);

    // Luminous Core Halo Aura
    const haloGeometry = new THREE.SphereGeometry(0.42, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    sculptureGroup.add(haloMesh);

    // Outer subtle chromatic aura
    const outerAuraGeometry = new THREE.SphereGeometry(0.68, 32, 32);
    const outerAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const outerAuraMesh = new THREE.Mesh(outerAuraGeometry, outerAuraMaterial);
    sculptureGroup.add(outerAuraMesh);

    // -------------------------------------------------------------
    // PETAL TIERS: Translucent Glass Mandala Layers
    // -------------------------------------------------------------
    // Tier 1: Inner Cupped Petals (6 petals, champagne / peach glow)
    const tier1Group = new THREE.Group();
    sculptureGroup.add(tier1Group);

    const petalGeom1 = createCurvedPetalGeometry(0.42, 1.15, 0.18);
    const petalMat1 = new THREE.MeshPhysicalMaterial({
      color: 0xffedd5, // Champagne peach
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      metalness: 0.02,
      ior: 1.5,
      thickness: 0.35,
      attenuationColor: new THREE.Color(0xfda4af), // Peach rose
      attenuationDistance: 0.7,
      specularIntensity: 1.0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });

    const countTier1 = 6;
    for (let i = 0; i < countTier1; i++) {
      const angle = (i / countTier1) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeom1, petalMat1);
      petal.rotation.z = angle;
      petal.rotation.x = 0.58; // tilted upward/inward
      petal.position.set(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0.05);
      tier1Group.add(petal);
    }

    // Tier 2: Middle Bloom Petals (10 petals, iridescent lavender)
    const tier2Group = new THREE.Group();
    sculptureGroup.add(tier2Group);

    const petalGeom2 = createCurvedPetalGeometry(0.54, 1.55, 0.22);
    const petalMat2 = new THREE.MeshPhysicalMaterial({
      color: 0xe9d5ff, // Iridescent lavender
      transmission: 0.91,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      metalness: 0.03,
      ior: 1.48,
      thickness: 0.45,
      attenuationColor: new THREE.Color(0xc084fc), // Soft violet
      attenuationDistance: 0.9,
      specularIntensity: 1.0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
    });

    const countTier2 = 10;
    const offsetTier2 = Math.PI / countTier2;
    for (let i = 0; i < countTier2; i++) {
      const angle = (i / countTier2) * Math.PI * 2 + offsetTier2;
      const petal = new THREE.Mesh(petalGeom2, petalMat2);
      petal.rotation.z = angle;
      petal.rotation.x = 0.95; // cupping outwards
      petal.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, -0.02);
      tier2Group.add(petal);
    }

    // Tier 3: Outer Crown Petals (14 petals, celestial lilac & peach)
    const tier3Group = new THREE.Group();
    sculptureGroup.add(tier3Group);

    const petalGeom3 = createCurvedPetalGeometry(0.66, 1.9, 0.26);
    const petalMat3 = new THREE.MeshPhysicalMaterial({
      color: 0xf5d0fe, // Celestial soft lilac
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.12,
      metalness: 0.02,
      ior: 1.46,
      thickness: 0.5,
      attenuationColor: new THREE.Color(0x818cf8), // Electric indigo refraction
      attenuationDistance: 1.2,
      specularIntensity: 1.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.12,
    });

    const countTier3 = 14;
    for (let i = 0; i < countTier3; i++) {
      const angle = (i / countTier3) * Math.PI * 2;
      const petal = new THREE.Mesh(petalGeom3, petalMat3);
      petal.rotation.z = angle;
      petal.rotation.x = 1.32; // broadly sweeping open
      petal.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, -0.1);
      tier3Group.add(petal);
    }

    // -------------------------------------------------------------
    // PARTICLES: Orbiting Stardust of Awareness
    // -------------------------------------------------------------
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.1 + Math.random() * 2.1;
      const angle = Math.random() * Math.PI * 2;
      const heightVal = (Math.random() - 0.5) * 2.4;

      particleRadii[i] = radius;
      particleAngles[i] = angle;
      particleHeights[i] = heightVal;
      particleSpeeds[i] = 0.2 + Math.random() * 0.5;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = heightVal;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleTexture = createParticleTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xfce7f3,
    });

    const particleSystem = new THREE.Points(particleGeom, particleMat);
    masterGroup.add(particleSystem);

    // Initial entrance sequence state
    let entranceTime = 0;
    const isInitialEntrance = true;

    // -------------------------------------------------------------
    // INTERACTION LISTENERS: Mouse move, Touch drag, Hover
    // -------------------------------------------------------------
    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current.targetX = normX * 0.42;
      mousePos.current.targetY = normY * 0.38;
    };

    const handlePointerLeave = () => {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
      setIsHovered(false);
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('pointerenter', handlePointerEnter);

    // -------------------------------------------------------------
    // RESIZE OBSERVER
    // -------------------------------------------------------------
    const handleResize = () => {
      const w = container.clientWidth || size || 320;
      const h = container.clientHeight || size || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // -------------------------------------------------------------
    // ANIMATION RENDER LOOP (Frame-rate independent)
    // -------------------------------------------------------------
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      entranceTime += delta;

      // Handle Entrance Staging (assembled bloom)
      let entranceProgress = 1.0;
      if (isInitialEntrance && !reducedMotion) {
        entranceProgress = Math.min(1.0, entranceTime / 1.8);
      }

      // Spring physics for pointer tracking
      const springFactor = 0.06;
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * springFactor;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * springFactor;

      // Decay click ripple
      if (rippleRef.current > 0.001) {
        rippleRef.current *= 0.94;
      } else {
        rippleRef.current = 0;
      }

      // Step-specific morph parameters
      const step = stepTargetRef.current;
      let targetRotZ = 0;
      let targetTiltX = 0.12;
      let coreColorTarget = new THREE.Color(0xfef08a); // champagne
      let auraColorTarget = new THREE.Color(0xc084fc); // lavender

      switch (step) {
        case 1: // Language
          targetTiltX = 0.28;
          targetRotZ = 0.1;
          coreColorTarget = new THREE.Color(0x93c5fd); // tranquil azure
          auraColorTarget = new THREE.Color(0xa78bfa); // iris violet
          break;
        case 2: // Addressing
          targetTiltX = 0.08;
          targetRotZ = -0.15;
          coreColorTarget = new THREE.Color(0xfda4af); // rose warmth
          auraColorTarget = new THREE.Color(0xfbbf24); // golden amber
          break;
        case 3: // About
          targetTiltX = 0.22;
          targetRotZ = 0.25;
          coreColorTarget = new THREE.Color(0x86efac); // emerald grounding
          auraColorTarget = new THREE.Color(0x38bdf8); // sky clarity
          break;
        case 4: // Consent & Enter
          targetTiltX = 0.05;
          targetRotZ = 0;
          coreColorTarget = new THREE.Color(0xfef08a); // celestial radiance
          auraColorTarget = new THREE.Color(0x818cf8); // indigo sovereignty
          break;
        default: // Step 0 Intro
          targetTiltX = 0.14;
          targetRotZ = 0;
          break;
      }

      // Breathing rhythm
      const breatheTime = now * 0.0012;
      const breathPulse = Math.sin(breatheTime * 1.5) * 0.04;
      const rippleWave = rippleRef.current * 0.18;

      if (!reducedMotion) {
        // Continuous ambient rotation
        sculptureGroup.rotation.y += 0.0035;

        // Interactive mouse & step tilt
        sculptureGroup.rotation.x = targetTiltX + mousePos.current.y;
        sculptureGroup.rotation.z = targetRotZ + mousePos.current.x * 0.5;

        // Petal layer breathing with organic phase offsets
        tier1Group.rotation.z = Math.sin(breatheTime * 1.2) * 0.04;
        tier2Group.rotation.z = Math.sin(breatheTime * 1.0 + 1.2) * -0.03;
        tier3Group.rotation.z = Math.sin(breatheTime * 0.8 + 2.4) * 0.025;

        // Dynamic scale
        const currentScale = (1 + breathPulse + rippleWave) * entranceProgress;
        sculptureGroup.scale.set(currentScale, currentScale, currentScale);

        // Breathing Core Light
        const lightPulse = 2.0 + Math.sin(breatheTime * 2.0) * 0.6 + rippleRef.current * 1.8;
        corePointLight.intensity = lightPulse;

        // Core colors smooth lerp
        coreMaterial.color.lerp(coreColorTarget, 0.05);
        outerAuraMaterial.color.lerp(auraColorTarget, 0.05);

        // Core mesh pulsation
        const coreScale = 1.0 + Math.sin(breatheTime * 2.4) * 0.08 + rippleRef.current * 0.25;
        coreMesh.scale.set(coreScale, coreScale, coreScale);
        haloMesh.scale.set(coreScale * 1.1, coreScale * 1.1, coreScale * 1.1);

        // Orbiting particles update
        const positions = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          particleAngles[i] += particleSpeeds[i] * 0.008;
          const currentRadius = particleRadii[i] + rippleRef.current * 0.4;
          positions[i * 3] = Math.cos(particleAngles[i]) * currentRadius;
          positions[i * 3 + 1] = particleHeights[i] + Math.sin(particleAngles[i] * 2 + breatheTime) * 0.15;
          positions[i * 3 + 2] = Math.sin(particleAngles[i]) * currentRadius;
        }
        particleGeom.attributes.position.needsUpdate = true;
      } else {
        // Reduced motion: static dignified presentation
        sculptureGroup.rotation.set(0.18, 0.45, 0);
        sculptureGroup.scale.set(1, 1, 1);
        corePointLight.intensity = 2.0;
      }

      renderer.render(scene, camera);

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (reducedMotion) {
      animate(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('pointerenter', handlePointerEnter);

      // Dispose Three.js resources cleanly
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      outerAuraGeometry.dispose();
      outerAuraMaterial.dispose();

      petalGeom1.dispose();
      petalMat1.dispose();
      petalGeom2.dispose();
      petalMat2.dispose();
      petalGeom3.dispose();
      petalMat3.dispose();

      particleGeom.dispose();
      particleMat.dispose();
      particleTexture.dispose();

      renderer.dispose();
    };
  }, [interactive, reducedMotion, size]);

  // WebGL Fallback: High-Fidelity SVG Living Mandala
  if (!hasWebGL) {
    return (
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
        style={{ width: size || '100%', height: size || '100%' }}
        role="img"
        aria-label="Luminous Living Identity mandala of BECOMING"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-w-[280px] max-h-[280px] drop-shadow-[0_0_35px_rgba(196,181,253,0.35)] animate-pulse"
        >
          <defs>
            <radialGradient id="fallbackCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="40%" stopColor="#FDE68A" />
              <stop offset="80%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
            </radialGradient>
            <linearGradient id="fallbackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#DDD6FE" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g transform="translate(100, 100)">
            {/* Outer Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <path
                key={deg}
                d="M 0 0 C 18 -20 28 -55 0 -85 C -28 -55 -18 -20 0 0 Z"
                fill="url(#fallbackPetal)"
                transform={`rotate(${deg})`}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.8"
              />
            ))}
            {/* Inner Petals */}
            {[15, 75, 135, 195, 255, 315].map((deg) => (
              <path
                key={`inner-${deg}`}
                d="M 0 0 C 12 -12 18 -38 0 -58 C -18 -38 -12 -12 0 0 Z"
                fill="url(#fallbackCore)"
                transform={`rotate(${deg})`}
                opacity="0.85"
              />
            ))}
            {/* Luminous Central Core */}
            <circle cx="0" cy="0" r="16" fill="url(#fallbackCore)" />
            <circle cx="0" cy="0" r="24" fill="#FDE68A" opacity="0.25" className="animate-ping" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size || '100%', height: size || '100%' }}
      role="img"
      aria-label="Luminous 3D Living Identity sculpture of BECOMING"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing focus:outline-none"
        tabIndex={0}
      />
      {/* Subtle tactile hint when hovered */}
      {isHovered && interactive && !reducedMotion && (
        <div
          aria-hidden="true"
          className="absolute bottom-2 text-[10px] font-mono tracking-widest uppercase text-violet-400/80 pointer-events-none transition-opacity duration-300"
        >
          Click to ripple • Drag to turn
        </div>
      )}
    </div>
  );
};

export default LivingIdentity3D;
