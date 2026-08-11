function initHeart(scene) {
    // =====================================================
    // HEART TEXTURE
    // =====================================================

    function createLoveTexture() {
        const canvas = document.createElement("canvas");

        canvas.width = 256;
        canvas.height = 64;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold 28px Orbitron, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#ff0000";

        ctx.fillText(
            "I LOVE YOU",
            canvas.width / 2,
            canvas.height / 2
        );

        const texture = new THREE.CanvasTexture(canvas);

        texture.needsUpdate = true;

        return texture;
    }

    const loveTexture = createLoveTexture();

    // =====================================================
    // MAIN HEART
    // =====================================================

    const heartGroup = new THREE.Group();

    scene.add(heartGroup);

    const heartMaterialBase = {
        map: loveTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    };

    const heartParticles = [];

    // Small canvas used to determine the heart shape
    const shapeCanvas = document.createElement("canvas");

    shapeCanvas.width = 500;
    shapeCanvas.height = 500;

    const shapeCtx = shapeCanvas.getContext("2d");

    shapeCtx.clearRect(
        0,
        0,
        shapeCanvas.width,
        shapeCanvas.height
    );

    shapeCtx.fillStyle = "white";

    // Draw heart silhouette
    shapeCtx.beginPath();

    shapeCtx.moveTo(250, 430);

    /*shapeCtx.bezierCurveTo(
        60, 270,
        80, 80,
        250, 170
    );

    shapeCtx.bezierCurveTo(
        420, 80,
        440, 270,
        250, 420
    );*/

    shapeCtx.bezierCurveTo(
        80, 300,
        55, 105,
        175, 105
    );

    shapeCtx.bezierCurveTo(
        220, 105,
        245, 145,
        250, 180
    );

    shapeCtx.bezierCurveTo(
        255, 145,
        280, 105,
        325, 105
    );

    shapeCtx.bezierCurveTo(
        445, 105,
        420, 300,
        250, 430
    );

    shapeCtx.fill();

    const pixels = shapeCtx.getImageData(
        0,
        0,
        shapeCanvas.width,
        shapeCanvas.height
    ).data;

    // =====================================================
    // CREATE "I LOVE YOU" PARTICLES
    // =====================================================

    const PARTICLE_COUNT = 1326;

    for (let i = 0; i < PARTICLE_COUNT; i++) {

        let x;
        let y;
        let valid = false;

        // Find random point inside heart
        while (!valid) {

            x = Math.floor(Math.random() * 500);
            y = Math.floor(Math.random() * 500);

            const index = (y * 500 + x) * 4;

            if (pixels[index + 3] > 0) {
                valid = true;
            }
        }

        // Convert canvas coordinates to Three.js coordinates
        const posX = (x - 250) / 35;
        const posY = (250 - y) / 55;

        // Give the heart some depth
        const posZ = (Math.random() - 0.5) * 1.4;

        const material = new THREE.SpriteMaterial({
            map: loveTexture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const sprite = new THREE.Sprite(material);

        const size = 0.16 + Math.random() * 0.09;

        sprite.scale.set(
            size * 2.6,
            size,
            1
        );

        sprite.position.set(
            posX,
            posY,
            posZ
        );

        // Slight randomness
        sprite.rotation.z =
            (Math.random() - 0.5) * 0.25;

        heartGroup.add(sprite);

        heartParticles.push({

            sprite: sprite,

            baseX: posX,
            baseY: posY,
            baseZ: posZ,

            delay: Math.random() * 4,

            opacity: 0.15 + Math.random() * 0.45,

            speed: 0.5 + Math.random() * 1.2,

            phase: Math.random() * Math.PI * 2

        });
    }

    // =====================================================
    // ORBITING HEART
    // =====================================================

    function createHeartTexture() {

        const canvas = document.createElement("canvas");

        canvas.width = 128;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, 128, 128);

        ctx.font = "70px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#ff2020";

        ctx.fillText(
            "♥",
            64,
            64
        );

        return new THREE.CanvasTexture(canvas);
    }

    const heartTexture = createHeartTexture();

    // =====================================================
    // ORBITERS
    // =====================================================

    const orbiters = [];

    for (let i = 0; i < 8; i++) {

        const material = new THREE.SpriteMaterial({
            map: heartTexture,
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const heart = new THREE.Sprite(material);

        const size =
            0.18 +
            Math.random() * 0.16;

        heart.scale.set(
            size,
            size,
            1
        );

        scene.add(heart);

        // Trail
        const trailPositions = [];

        for (let j = 0; j < 25; j++) {

            trailPositions.push(
                new THREE.Vector3()
            );
        }

        const trailGeometry =
            new THREE.BufferGeometry();

        const positionArray =
            new Float32Array(25 * 3);

        trailGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positionArray,
                3
            )
        );

        const trailMaterial =
            new THREE.LineBasicMaterial({
                color: 0x660000,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });

        const trail =
            new THREE.Line(
                trailGeometry,
                trailMaterial
            );

        scene.add(trail);

        orbiters.push({

            heart: heart,

            trail: trail,

            trailPositions: trailPositions,

            angle:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.12 +
                Math.random() * 0.18,

            radiusX:
                4 +
                Math.random() * 3,

            radiusY:
                2.5 +
                Math.random() * 2,

            radiusZ:
                1 +
                Math.random() * 2,

            tilt:
                Math.random() *
                Math.PI,

            phase:
                Math.random() *
                Math.PI *
                2
        });
    }

    // =====================================================
    // FLOATING "I LOVE YOU" PARTICLES
    // =====================================================

    const floatingParticles = [];

    for (let i = 0; i < 60; i++) {

        const material = new THREE.SpriteMaterial({
            map: loveTexture,
            transparent: true,
            opacity:
                0.05 +
                Math.random() * 0.18,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const sprite =
            new THREE.Sprite(material);

        const size =
            0.12 +
            Math.random() * 0.12;

        sprite.scale.set(
            size * 2.7,
            size,
            1
        );

        sprite.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        );

        scene.add(sprite);

        floatingParticles.push({

            sprite: sprite,

            speed:
                0.05 +
                Math.random() * 0.15,

            phase:
                Math.random() *
                Math.PI * 2

        });
    }

    // =====================================================
    // ANIMATION
    // =====================================================
    function updateHeart(time) {
        // -------------------------------------------------
        // Heart breathing
        // -------------------------------------------------

        const heartbeat =
            1 +
            Math.sin(time * 1.7) * 0.025;

        heartGroup.scale.set(
            heartbeat,
            heartbeat,
            heartbeat
        );

        // -------------------------------------------------
        // Heart "I LOVE YOU" fade in
        // -------------------------------------------------

        heartParticles.forEach((particle) => {

            const localTime =
                time - particle.delay;

            if (localTime > 0) {

                const fade =
                    Math.min(
                        localTime * 0.7,
                        1
                    );

                const breathing =
                    Math.sin(
                        time *
                        particle.speed +
                        particle.phase
                    ) * 0.05;

                particle.sprite.material.opacity =
                    Math.max(
                        0,
                        particle.opacity +
                        breathing
                    ) * fade;

                // Very subtle movement
                particle.sprite.position.x =
                    particle.baseX +
                    Math.sin(
                        time * 0.4 +
                        particle.phase
                    ) * 0.015;

                particle.sprite.position.y =
                    particle.baseY +
                    Math.cos(
                        time * 0.35 +
                        particle.phase
                    ) * 0.015;
            }
        });

        // -------------------------------------------------
        // Orbiting hearts
        // -------------------------------------------------

        orbiters.forEach((orbiter) => {

            orbiter.angle +=
                orbiter.speed * 0.01;

            const angle =
                orbiter.angle;

            const x =
                Math.cos(angle) *
                orbiter.radiusX;

            const y =
                Math.sin(angle) *
                orbiter.radiusY;

            const z =
                Math.sin(
                    angle * 2 +
                    orbiter.phase
                ) *
                orbiter.radiusZ;

            // Slight 3D tilt
            const rotatedX =
                x * Math.cos(orbiter.tilt) -
                z * Math.sin(orbiter.tilt);

            const rotatedZ =
                x * Math.sin(orbiter.tilt) +
                z * Math.cos(orbiter.tilt);

            const target =
                new THREE.Vector3(
                    rotatedX,
                    y,
                    rotatedZ
                );

            orbiter.heart.position.copy(
                target
            );

            // Add newest position to trail
            orbiter.trailPositions.unshift(
                target.clone()
            );

            if (orbiter.trailPositions.length > 25) {
                orbiter.trailPositions.pop();
            }

            const positions =
                orbiter.trail.geometry
                    .attributes
                    .position
                    .array;

            orbiter.trailPositions.forEach((position, index) => {
                    positions[index * 3] = position.x;

                    positions[index * 3 + 1] = position.y;

                    positions[index * 3 + 2] = position.z;
                }
            );

            orbiter.trail.geometry.attributes.position.needsUpdate = true;

            // Heart pulse
            const pulse =
                1 +
                Math.sin(
                    time * 2 +
                    orbiter.phase
                ) * 0.15;

            orbiter.heart.scale.set(
                pulse * 0.25,
                pulse * 0.25,
                1
            );
        });

        // -------------------------------------------------
        // Floating text
        // -------------------------------------------------

        floatingParticles.forEach(
            (particle) => {

                particle.sprite.position.y +=
                    Math.sin(
                        time *
                        particle.speed +
                        particle.phase
                    ) * 0.0008;

                particle.sprite.position.x +=
                    Math.cos(
                        time *
                        particle.speed +
                        particle.phase
                    ) * 0.0004;
            }
        );
    }
    return updateHeart;
}