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
        // Clock has been deprecated in favor of Timer
        const timer = new THREE.Timer();
        let isVisible = true;

        const render = (timestamp) => {
            if (!isVisible) return; // Don't request next frame if out of viewport

            // update timer with current frame timestamp
            timer.update(timestamp);
            const elapsedTime = timer.getElapsed();

            // Slow, drifting rotation
            particleMesh.rotation.y = elapsedTime * 0.05;
            particleMesh.rotation.x = elapsedTime * 0.02;

            renderer.render(scene, camera);
            animationFrameId = window.requestAnimationFrame(render);
        };

        // Initialize IntersectionObserver for Smart Resource Management
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            isVisible = entry.isIntersecting;

            if (isVisible) {
                // Resume animation loop
                if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
                render();
            } else {
                // Pause animation loop
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }, { threshold: 0 }); // Fires correctly when exactly fully out of view

        if (mount) observer.observe(mount);

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

        // Strict Cleanup
        return () => {
            if (mount) observer.unobserve(mount);
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) window.cancelAnimationFrame(animationFrameId);

            if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }

            // Strictly dispose geometries and materials to avoid memory leaks
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
            // Force WebGL context loss to ensure garbage collection
            renderer.forceContextLoss();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute top-0 left-0 w-full h-full z-1 pointer-events-none"
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        />
    );
};

export default HeroCanvas;
