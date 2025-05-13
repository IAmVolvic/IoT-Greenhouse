import { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingLabelProps {
    camera: THREE.PerspectiveCamera;
    position: THREE.Vector3;
    children: React.ReactNode;
}

export const FloatingLabel = (props: FloatingLabelProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const update = () => {
            if (!ref.current || !props.camera) return;

            const vector = props.position.clone().project(props.camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

            ref.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

            animationFrameId = requestAnimationFrame(update);
        };

        update();

        return () => cancelAnimationFrame(animationFrameId);
    }, [props.camera, props.position]);

    return (
        <div ref={ref} className="absolute z-[100]" style={{ transform: `translate(-50%, -50%)` }}>
            {props.children}
        </div>
    );
}