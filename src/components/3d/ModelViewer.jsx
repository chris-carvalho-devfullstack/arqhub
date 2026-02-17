import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, useProgress } from '@react-three/drei';
import * as THREE from 'three'; // Importação necessária para configurar os botões do mouse

// --- 1. INTERFACE (HUD) ---
const UIControls = ({ controlsRef }) => {
  const handleMove = (direction) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const angleStep = Math.PI / 8;
    // Pega a distância atual para calibrar a velocidade do botão de zoom
    const currentDist = controls.object.position.distanceTo(controls.target);

    switch(direction) {
      case 'left': controls.setAzimuthalAngle(controls.getAzimuthalAngle() - angleStep); break;
      case 'right': controls.setAzimuthalAngle(controls.getAzimuthalAngle() + angleStep); break;
      case 'up': controls.setPolarAngle(Math.max(0.1, controls.getPolarAngle() - angleStep)); break;
      case 'down': controls.setPolarAngle(Math.min(Math.PI / 1.1, controls.getPolarAngle() + angleStep)); break;
      case 'zoomIn': controls.object.translateZ(-currentDist * 0.2); break; // Aumentei a força do zoom pelo botão
      case 'zoomOut': controls.object.translateZ(currentDist * 0.2); break;
    }
    controls.update();
  };

  return (
    <div className="hud-overlay">
      <div className="d-pad">
        <button onClick={() => handleMove('up')} className="btn-ctrl up">▲</button>
        <div className="middle-row">
          <button onClick={() => handleMove('left')} className="btn-ctrl left">◀</button>
          <button onClick={() => handleMove('right')} className="btn-ctrl right">▶</button>
        </div>
        <button onClick={() => handleMove('down')} className="btn-ctrl down">▼</button>
      </div>
      <div className="zoom-pad">
        <button onClick={() => handleMove('zoomIn')} className="btn-ctrl zoom">+</button>
        <button onClick={() => handleMove('zoomOut')} className="btn-ctrl zoom">-</button>
      </div>
      
      {/* Dica visual para o usuário */}
      <div className="hint-text">
        🖱️ Dir: Arrastar | Esq: Girar
      </div>

      <style>{`
        .hud-overlay { position: absolute; bottom: 30px; right: 30px; display: flex; gap: 20px; z-index: 100; pointer-events: none; flex-direction: column; align-items: flex-end; }
        .d-pad, .zoom-pad { pointer-events: auto; display: flex; gap: 5px; }
        .d-pad { flex-direction: column; align-items: center; }
        .middle-row { display: flex; gap: 5px; }
        .zoom-pad { flex-direction: column; justify-content: center; }
        .hint-text { color: rgba(255,255,255,0.6); font-size: 0.75rem; margin-top: 8px; font-family: sans-serif; text-shadow: 0 1px 2px black; }
        .btn-ctrl { background: rgba(20, 20, 20, 0.6); border: 1px solid rgba(255,255,255,0.2); color: white; width: 45px; height: 45px; border-radius: 12px; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-size: 16px; user-select: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        .btn-ctrl:hover { background: white; color: black; transform: scale(1.1); box-shadow: 0 8px 15px rgba(255,255,255,0.2); }
        .btn-ctrl:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
};

// --- 2. LOADER ---
const LoadingScreen = () => {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="spinner"></div>
        <div className="loader-info"><span className="percent">{progress.toFixed(0)}%</span><span className="status">Carregando...</span></div>
      </div>
      <style>{`
        .loader-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #111; z-index: 200; display: flex; align-items: center; justify-content: center; }
        .loader-box { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .spinner { width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #883aea; border-radius: 50%; animation: spin 1s linear infinite; }
        .loader-info { display: flex; flex-direction: column; align-items: center; color: white; font-family: sans-serif; }
        .percent { font-size: 1.5rem; font-weight: bold; }
        .status { font-size: 0.9rem; opacity: 0.7; margin-top: 5px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- 3. MODELO ---
function Model(props) {
  const { scene } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/LittlestTokyo.glb');
  return <primitive object={scene} {...props} />;
}

// --- 4. COMPONENTE PRINCIPAL ---
export default function ModelViewer() {
  const controlsRef = useRef();

  return (
    <div className="viewer-container">
      <LoadingScreen />
      
      <Canvas shadows dpr={[1, 2]} performance={{ min: 0.5 }} camera={{ fov: 40, position: [100, 50, 100] }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
            <Model scale={0.01} />
          </Stage>
        </Suspense>

        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          
          // --- CONFIGURAÇÃO DE NAVEGAÇÃO COMPLETA ---
          enablePan={true}           // Ativa o arrastar
          screenSpacePanning={true}  // Arrastar move na tela (Cima/Baixo/Esq/Dir)
          panSpeed={1}
          
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,  // Botão Esq: Gira
            MIDDLE: THREE.MOUSE.DOLLY, // Scroll/Meio: Zoom
            RIGHT: THREE.MOUSE.PAN     // Botão Dir: Arrasta (FEATURE RESTAURADA)
          }}
          
          // --- CONFIGURAÇÃO DE ZOOM (LIBERADO) ---
          minDistance={2}    // ANTES ERA 20. Agora é 2 (Zoom MUITO PERTO permitido)
          maxDistance={1000} // Limite de longe aumentado
          enableZoom={true}

          // --- FLUIDEZ ---
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.6}
          target={[0, 15, 0]} 
        />
      </Canvas>

      <UIControls controlsRef={controlsRef} />

      <style>{`
        .viewer-container { width: 100%; height: 100%; position: relative; background: #111; cursor: grab; }
        .viewer-container:active { cursor: grabbing; }
      `}</style>
    </div>
  );
}