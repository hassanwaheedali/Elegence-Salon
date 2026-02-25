import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene, Camera, Renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Particle System Geometry
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles over a large volume
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Particle System Material
        // Extract champagne color from CSS variable or use exact hex
        const particleColor = new THREE.Color('#d9822b'); // Champagne base
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: particleColor,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending, // Gives an "ember" feel
            depthWrite: false
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // Animation Loop
        let animationFrameId;
        const clock = new THREE.Clock();

        const render = () => {
            const elapsedTime = clock.getElapsedTime();

            // Slow, drifting rotation
            particleMesh.rotation.y = elapsedTime * 0.05;
            particleMesh.rotation.x = elapsedTime * 0.02;

            renderer.render(scene, camera);
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        // Handle Window Resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationFrameId);
            if (mount) mount.removeChild(renderer.domElement);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
        />
    );
};

export default HeroCanvas;
