document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".hero-overlay");
    let width = container.clientWidth;
    let height = container.clientHeight;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Camera
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Scenes
    const waveScene = new THREE.Scene();
    
    // Render Targets for Ping-Pong Buffering
    let waveRT1 = new THREE.WebGLRenderTarget(width, height);
    let waveRT2 = new THREE.WebGLRenderTarget(width, height);

    // Full-Screen Quad for Wave Simulation
    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const waveUniforms = {
        u_prevFrame: { value: waveRT1.texture },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_mouse: { value: new THREE.Vector2(-9999, -9999) },
        u_mouseDown: { value: 0.0 },
        u_time: { value: 0.0 },
        u_delta: { value: 1.0 },
    };

    const waveSimMaterial = new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }`,
        fragmentShader: `
        precision highp float;
        uniform sampler2D u_prevFrame;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_mouseDown;
        uniform float u_time;
        uniform float u_delta;
        varying vec2 vUv;

        void main() {
            vec2 texelSize = 1.0 / u_resolution;
            vec4 state = texture2D(u_prevFrame, vUv);
            float pressure = state.r;
            float velocity = state.g;

            // Neighbor sampling
            vec2 dx = vec2(texelSize.x, 0.0);
            vec2 dy = vec2(0.0, texelSize.y);
            float pR = texture2D(u_prevFrame, vUv + dx).r;
            float pL = texture2D(u_prevFrame, vUv - dx).r;
            float pU = texture2D(u_prevFrame, vUv + dy).r;
            float pD = texture2D(u_prevFrame, vUv - dy).r;

            // Wave equation
            velocity += u_delta * (-2.0 * pressure + pR + pL + pU + pD) * 0.25;
            pressure += u_delta * velocity;

            // Damping for smooth decay
            velocity -= 0.005 * u_delta * pressure;
            velocity *= 0.998;
            pressure *= 0.999;

            // Mouse interaction
            if (u_mouseDown > 0.5) {
                vec2 px = vUv * u_resolution;
                float dist = distance(px, u_mouse);
                if (dist < 20.0) {
                    pressure += (1.0 - (dist / 20.0));
                }
            }

            gl_FragColor = vec4(pressure, velocity, (pR - pL) / 2.0, (pU - pD) / 2.0);
        }`,
        uniforms: waveUniforms,
    });

    const waveQuad = new THREE.Mesh(quadGeometry, waveSimMaterial);
    waveScene.add(waveQuad);

    // Mouse Events for Ripples
    let mouseDown = false;
    let mousePos = new THREE.Vector2(-9999, -9999);

    window.addEventListener("mousemove", (e) => {
        mousePos.set(e.clientX, height - e.clientY);
    });

    window.addEventListener("mousedown", () => (mouseDown = true));
    window.addEventListener("mouseup", () => (mouseDown = false));

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        waveUniforms.u_time.value = clock.getElapsedTime();
        waveUniforms.u_mouse.value = mousePos;
        waveUniforms.u_mouseDown.value = mouseDown ? 1.0 : 0.0;

        // Simulate Waves
        renderer.setRenderTarget(waveRT2);
        renderer.render(waveScene, orthoCamera);
        [waveRT1, waveRT2] = [waveRT2, waveRT1];
        waveUniforms.u_prevFrame.value = waveRT1.texture;

        // Render Final Output
        renderer.setRenderTarget(null);
        renderer.render(waveScene, orthoCamera);
    }
    animate();

    // Resize Handling
    window.addEventListener("resize", () => {
        width = container.clientWidth;
        height = container.clientHeight;
        renderer.setSize(width, height);
        waveUniforms.u_resolution.value.set(width, height);
    });
});
