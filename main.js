window.addEventListener("DOMContentLoaded", () => {
    const boot = document.getElementById("boot");
    const log = document.getElementById("log");
    const bar = document.getElementById("progress-bar");
    const buttonSound = document.getElementById("buttonSound")
    const bgMusic = document.getElementById("bgMusic");
    const startScreen = document.getElementById("start-screen");
    const initialize = document.getElementById("initialize");

    /*window.addEventListener("", () => {
        console.log("Clicked");
        music.currentTime = 111;
        music.volume = 0.3;
        music.play().catch(err => {
            console.error(err);
        });
    }, { once: true });*/

    const messages = [
        "INITIALIZING RED CODE PROTOCOL...",
        "SCANNING EMOTIONAL SUBSYSTEM...",
        "SEARCHING...",
        "TARGET FOUND.",
        "ESTABLISHING CONNECTION..."
    ];

    let progress = 0;
    let messageIndex = 0;

    function typeMessage(message, callback) {
        let index = 0;

        // Create a new line element
        const line = document.createElement("div");
        log.appendChild(line);

        const typing = setInterval(() => {
            line.textContent += message[index];
            index++;

            if (index >= message.length) {
                clearInterval(typing);

                if (callback) {
                    setTimeout(callback, 100);
                }
            }
        }, 40);
    }

    function showNextMessage() {
        if (messageIndex >= messages.length) {
            return;
        }

        typeMessage(messages[messageIndex], () => {
            messageIndex++;
            showNextMessage();
        });
    }

    initialize.addEventListener("click", () => {
        // Play button activation sound
        buttonSound.currentTime = 0.2;
        buttonSound.volume = 0.8;
        buttonSound.play();

        // Wait for click sound, then start music
        setTimeout(() => {
            bgMusic.currentTime = 111;
            bgMusic.volume = 0.5;

            bgMusic.play().catch(err => {
                console.error(err);
            });
        }, 1500);

        startScreen.style.transition = "opacity 1s ease";
        startScreen.style.opacity = 0;

        setTimeout(() => {

            startScreen.style.display = "none";

            boot.style.display = "flex";

            showNextMessage();

            startProgress();

        }, 1000);

    }, { once: true });

    //showNextMessage();

    /*function addLog() {
        if (messageIndex < messages.length) {
            log.innerHTML = messages[messageIndex];
            //log.innerHTML += messages[messageIndex] + "<br/>";
            messageIndex++;
        }
    }*/

    //const logInterval = setInterval(addLog, 600);

    function startProgress() {
        const progressInterval = setInterval(() => {
            progress += Math.random() * 2.6 + 0.7;

            if (progress > 100) progress = 100;

            bar.style.width = progress + "%";

            if (progress === 100) {
                clearInterval(progressInterval);
                //clearInterval(logInterval);

                setTimeout(startExperience, 100);
            }
        }, 100);
    }

    function startExperience() {
        boot.style.transition = "opacity 1s ease";
        boot.style.opacity = 0;

        //music.volume = 0.3;
        //music.currentTime = 111;
        //music.play();

        //Fade out music
        /*const fade = setInterval(() => {
            if(music.volume > 0.01) {
                music.volume -= 0.04;
            }
            else {
                music.volume = 0;
                music.pause();
                clearInterval(fade);
            }
        }, 100);*/

        /*music.play().catch(error => {
            console.log("Autoplay blocked:", error);
        });*/

        setTimeout(() => {
            boot.style.display = "none";

            // NOW start your Three.js world
            initThree();

        }, 1000);
    }
    
    function initThree() {

    // =========================
    // RED CODE PROTOCOL - CORE
    // =========================

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

    const canvas = document.querySelector("#scene");

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
    }
});