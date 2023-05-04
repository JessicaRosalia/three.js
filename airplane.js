let camera, scene, renderer;
let airplane, airplaneSpeed = 0;
let obstacles = [];

const init = () => {
  // Configura a cena
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#87CEEB");

  // Configura a câmera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  // Cria uma luz
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 20);
  scene.add(light);

  // Cria os obstáculos
  for (let i = 0; i < 5; i++) {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.x = (Math.random() - 0.5) * 20;
    obstacle.position.y = (Math.random() - 0.5) * 20;
    obstacle.position.z = (Math.random() - 0.5) * 20;
    obstacles.push(obstacle);
    scene.add(obstacle);
  }

  // Cria o renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let loader = new THREE.GLTFLoader();
  loader.load('model/aviao_airplane_second_version/scene.gltf', function(gltf){
    console.log(gltf);
      scene.add(gltf.scene);
      airplane = gltf.scene.children[0];
        // airplane.position.x = 4;
        // airplane.rotation.x = -30;
        airplane.rotation.z = 20;
    scene.add(airplane);

     animate();
  });
};

const animate = () => {
  requestAnimationFrame(animate);

  // Movimenta o avião
  if(airplane) {
    airplane.position.x += airplaneSpeed;
    airplane.rotation.z += airplaneSpeed / 20;
    }

  // Movimenta os obstáculos
  obstacles.forEach((obstacle) => {
    obstacle.position.x += airplaneSpeed + 0.1;
    obstacle.position.z -= 0.1;
    if (obstacle.position.z < -30) {
      obstacle.position.z = 30;
      obstacle.position.x = (Math.random() - 0.5) * 20;
      obstacle.position.y = (Math.random() - 0.5) * 20;
    }
  });

  // Verifica colisão com os obstáculos
  if(airplane){
    if (obstacles.some((obstacle) => {
        const dx = airplane.position.x - obstacle.position.x;
        const dy = airplane.position.y - obstacle.position.y;
        const dz = airplane.position.z - obstacle.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance < 1.5;
      })
    ) {
      console.log("Game over!");
      airplaneSpeed = 0;
    }
  }

  // Renderiza a cena
  renderer.render(scene, camera);
};

// Inicializa o jogo
init();
animate();

// Movimenta o avião para a esquerda quando a seta esquerda é pressionada
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    airplaneSpeed = -0.1;
  }
});

// Movimenta o avião para a direita quando a seta direita é pressionada
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    airplaneSpeed = 0.1;
  }
});

// Movimenta o avião para cima quando a seta para cima é pressionada
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    airplane.position.y += 0.1;
  }
});

// Movimenta o avião para baixo quando a seta para baixo é pressionada
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowDown") {
    airplane.position.y -= 0.1;
  }
});

// Para o avião quando a seta é liberada
document.addEventListener("keyup", () => {
  airplaneSpeed = 0;
});