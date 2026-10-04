import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DESTINATIONS } from '../data/destinations';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

// Helper to convert lat/lng to 3D Sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

// Glowing Destination Marker Pin
const DestinationMarker: React.FC<{
  destination: (typeof DESTINATIONS)[0];
  radius: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ destination, radius, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const position = useMemo(() => {
    return latLngToVector3(destination.coordinates.lat, destination.coordinates.lng, radius * 1.015);
  }, [destination, radius]);

  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const scale = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 4 + destination.coordinates.lat);
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Outer pulsing beacon ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.07, 0.12, 16]} />
        <meshBasicMaterial
          color={isSelected ? '#2dd4bf' : '#38bdf8'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Center glowing core sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(destination.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#2dd4bf' : '#38bdf8'}
          emissive={isSelected ? '#2dd4bf' : '#0284c7'}
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>

      {/* Floating 3D HTML Tooltip when selected */}
      {isSelected && (
        <Html distanceFactor={12} position={[0, 0.25, 0]} center zIndexRange={[100, 0]}>
          <div className="w-56 glass-card rounded-xl p-3 border border-brand-400/50 shadow-2xl backdrop-blur-xl text-left pointer-events-auto">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Twin
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold">
                {destination.region}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">{destination.name}</h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
              {destination.description}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate(`/destination/${destination.id}`)}
                className="flex-1 py-1 px-2 rounded-lg bg-gradient-to-r from-brand-500 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:opacity-90 shadow-glow-sky"
              >
                <span>Explore</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/experience/${destination.id}`)}
                className="py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-medium"
              >
                Virtual 3D
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Procedural Globe Sphere with Atmospheric Glow and Constellation Points
const GlobeSphere: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ selectedId, onSelect }) => {
  const globeGroupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const radius = 2.4;

  // Generate glowing grid line vertices
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    // Latitude parallels
    for (let lat = -70; lat <= 70; lat += 20) {
      const line: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 10) {
        const [x, y, z] = latLngToVector3(lat, lng, radius);
        line.push(new THREE.Vector3(x, y, z));
      }
      lines.push(line);
    }
    // Longitude meridians
    for (let lng = -180; lng < 180; lng += 30) {
      const line: THREE.Vector3[] = [];
      for (let lat = -80; lat <= 80; lat += 10) {
        const [x, y, z] = latLngToVector3(lat, lng, radius);
        line.push(new THREE.Vector3(x, y, z));
      }
      lines.push(line);
    }
    return lines;
  }, [radius]);

  // Generate particle constellation points around surface
  const particles = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (1.002 + Math.random() * 0.02);
      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [radius]);

  // Slow continuous rotation
  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.12;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* Deep Navy/Black Ocean Base Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#061226"
          roughness={0.7}
          metalness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Procedural Luminous Meridian Grid */}
      {gridLines.map((line, idx) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line);
        const material = new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.35 });
        const lineObj = new THREE.Line(geometry, material);
        return <primitive key={idx} object={lineObj} />;
      })}

      {/* Surface Sparkle Constellation */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#38bdf8"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>

      {/* Glowing Outer Atmospheric Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Destination Markers */}
      {DESTINATIONS.map((dest) => (
        <DestinationMarker
          key={dest.id}
          destination={dest}
          radius={radius}
          isSelected={selectedId === dest.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
};

export const EarthGlobe: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('kashmir');

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-3xl overflow-hidden glass-panel border border-brand-500/20 shadow-2xl flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(3,7,18,0)_70%)] pointer-events-none" />

      {/* Canvas 3D Viewport */}
      <Canvas
        camera={{ position: [0, 1.2, 5.2], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.6} color="#38bdf8" />

        <GlobeSphere
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay Quick Navigation Bar for Hotspots */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="glass-panel px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-slate-300 flex items-center space-x-2 pointer-events-auto backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-brand-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Drag to rotate the 3D Earth • Click any glowing node</span>
          <span className="sm:hidden">Rotate & tap nodes</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto max-w-full pointer-events-auto no-scrollbar py-1">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedId(d.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap ${
                selectedId === d.id
                  ? 'bg-brand-500 text-white shadow-glow-sky'
                  : 'bg-navy-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-brand-500/30'
              }`}
            >
              {d.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
