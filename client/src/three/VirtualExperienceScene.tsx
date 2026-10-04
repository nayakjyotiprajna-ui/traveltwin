import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Destination, Hotspot } from '../types';
import { Sparkles, MapPin, Volume2, Camera, CheckCircle2 } from 'lucide-react';

interface SceneProps {
  destination: Destination;
  activeHotspot: Hotspot | null;
  onSelectHotspot: (h: Hotspot | null) => void;
  onActivityComplete: (name: string) => void;
  completedActivities: string[];
}

// 3D Hotspot Marker in Virtual Environment
const HotspotMesh: React.FC<{
  hotspot: Hotspot;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ hotspot, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = hotspot.position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.15;
    }
  });

  return (
    <group position={hotspot.position}>
      {/* Floating Gem Marker */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isSelected ? '#2dd4bf' : '#38bdf8'}
          emissive={isSelected ? '#14b8a6' : '#0284c7'}
          emissiveIntensity={1.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ground Projection Ring */}
      <mesh position={[0, -hotspot.position[1] + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* 3D Label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {hotspot.title}
      </Text>
    </group>
  );
};

// Procedural 3D Environment based on destination type
const EnvironmentLandscape: React.FC<{ destination: Destination }> = ({ destination }) => {
  const type = destination.threeDType;

  return (
    <group>
      {/* Mountain Landscape (Kashmir, Ladakh) */}
      {type === 'mountain' && (
        <group>
          {/* Ground snow & rock terrain */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[60, 60, 32, 32]} />
            <meshStandardMaterial color="#0f2137" roughness={0.9} />
          </mesh>

          {/* Distant Mountain Peaks */}
          {[-12, -4, 4, 12].map((x, i) => (
            <mesh key={i} position={[x * 2, 4 + (i % 2) * 2, -18 - (i % 3) * 3]}>
              <coneGeometry args={[7 + (i % 3) * 2, 12 + (i % 2) * 4, 5]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#1e3a5f' : '#2a4d75'}
                roughness={0.8}
              />
            </mesh>
          ))}

          {/* Snowcaps on peaks */}
          {[-12, -4, 4, 12].map((x, i) => (
            <mesh key={`snow-${i}`} position={[x * 2, 8 + (i % 2) * 3.5, -18 - (i % 3) * 3]}>
              <coneGeometry args={[3.2, 5, 5]} />
              <meshStandardMaterial color="#f0f9ff" roughness={0.3} />
            </mesh>
          ))}

          {/* Pine Trees */}
          {[-8, -5, -2, 2, 6, 9].map((x, idx) => (
            <group key={`tree-${idx}`} position={[x * 1.5, 0, -4 - (idx % 4) * 2]}>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 1.2]} />
                <meshStandardMaterial color="#3f2314" />
              </mesh>
              <mesh position={[0, 1.8, 0]}>
                <coneGeometry args={[0.9, 2.2, 6]} />
                <meshStandardMaterial color="#064e3b" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Coastal Landscape (Goa) */}
      {type === 'coastal' && (
        <group>
          {/* Sandy Shore */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}>
            <planeGeometry args={[60, 20]} />
            <meshStandardMaterial color="#c29b62" roughness={0.9} />
          </mesh>

          {/* Shimmering Ocean Water */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -16]}>
            <planeGeometry args={[60, 40]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              metalness={0.6}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Distant Lighthouse Bastion */}
          <mesh position={[0, 2.5, -10]}>
            <cylinderGeometry args={[0.8, 1.2, 5, 16]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[0, 5.2, -10]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
          </mesh>
        </group>
      )}

      {/* Tropical Nature / Backwaters (Kerala) */}
      {type === 'nature' && (
        <group>
          {/* Lush Greenery Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#064e3b" roughness={0.8} />
          </mesh>

          {/* Winding Canal Water Strip */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -3]}>
            <planeGeometry args={[60, 8]} />
            <meshStandardMaterial
              color="#0f766e"
              roughness={0.2}
              metalness={0.4}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      )}

      {/* Palace & Royal Sandstone Citadel (Rajasthan, Konark) */}
      {(type === 'palace' || type === 'temple') && (
        <group>
          {/* Terracotta/Sandstone Courtyard */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>

          {/* Grand Pillars and Arches */}
          {[-6, -2, 2, 6].map((x, idx) => (
            <group key={`col-${idx}`} position={[x * 1.5, 0, -8]}>
              <mesh position={[0, 2.5, 0]}>
                <cylinderGeometry args={[0.4, 0.5, 5, 12]} />
                <meshStandardMaterial color="#d97706" roughness={0.7} />
              </mesh>
              <mesh position={[0, 5.2, 0]}>
                <boxGeometry args={[1.2, 0.6, 1.2]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

export const VirtualExperienceScene: React.FC<SceneProps> = ({
  destination,
  activeHotspot,
  onSelectHotspot,
  onActivityComplete,
  completedActivities
}) => {
  return (
    <Canvas camera={{ position: [0, 2.5, 7], fov: 50 }}>
      {/* Atmosphere & Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.4} castShadow />
      <pointLight position={[-8, 6, -5]} intensity={0.6} color="#38bdf8" />

      {/* Destination 3D Environment */}
      <EnvironmentLandscape destination={destination} />

      {/* Hotspots */}
      {destination.hotspots.map((h) => (
        <HotspotMesh
          key={h.id}
          hotspot={h}
          isSelected={activeHotspot?.id === h.id}
          onSelect={() => onSelectHotspot(h)}
        />
      ))}

      {/* Interactive Orbit & Pan Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={22}
      />
    </Canvas>
  );
};
