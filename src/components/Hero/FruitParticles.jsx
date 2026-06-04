import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FruitParticles(){
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if(!mount) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const palette = [0x8fe12f, 0xffb238, 0xff5f57, 0xf6ff70];
    const particles = Array.from({ length: 20 }, (_, index) => {
      const geometry = new THREE.SphereGeometry(index % 3 === 0 ? 0.075 : 0.045, 18, 18);
      const material = new THREE.MeshBasicMaterial({
        color: palette[index % palette.length],
        transparent: true,
        opacity: index % 3 === 0 ? 0.75 : 0.48,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.2, (Math.random() - 0.5) * 2);
      mesh.userData = {
        speed: 0.0025 + Math.random() * 0.004,
        drift: Math.random() * Math.PI * 2,
        startY: mesh.position.y,
      };
      group.add(mesh);
      return mesh;
    });

    const ambient = new THREE.PointLight(0x9cff42, 1.1, 8);
    ambient.position.set(0, 0, 3);
    scene.add(ambient);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.0018;
      group.rotation.x = Math.sin(Date.now() * 0.00025) * 0.05;
      particles.forEach((mesh) => {
        mesh.userData.drift += mesh.userData.speed;
        mesh.position.y = mesh.userData.startY + Math.sin(mesh.userData.drift * 2.6) * 0.28;
        mesh.position.x += Math.sin(mesh.userData.drift) * 0.0009;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if(!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      particles.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      if(renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="fruit-particles" ref={mountRef} aria-hidden="true" />;
}
