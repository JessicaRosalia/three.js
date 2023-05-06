let camera, scene, renderer;
let airplane, house, airplaneSpeed = 0;
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


  // cria um retangulo
  const createRectangle = (x, y, color) => {
    const rectangle = new THREE.PlaneGeometry(x, y);
    const material = new THREE.MeshBasicMaterial(
    { color: color });
    return new THREE.Mesh(rectangle, material);
  }

  //cria uma esfera
  const createSphere = (x, y, z, color) => {
    const sphere = new THREE.SphereGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({
        color,
    });
    return new THREE.Mesh(sphere,material);
  }
  
  // cria um cubo
  const createCube = (x, y, z, material, materialValue, hasWireframe = false) => {
    const cube = new THREE.BoxGeometry(x, y, z);
    const meshMaterial = new THREE.MeshBasicMaterial({
      [material]: materialValue,
      wireframe: hasWireframe,
    });
    
    return new THREE.Mesh(cube, meshMaterial);
  }

  // cria uma textura
  const createTexture = (textureSource) => {
    return new THREE.TextureLoader().load(
        textureSource,
    );
  }

  const texture = createTexture('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif');

  const rectangle = createRectangle(0.5, 0.2, '#0000ff');
  const sphere = createSphere(1, 32, 16, 'pink');
  const cube = createCube(1, 1, 1, 'color', 'red');
  const texturedCube = createCube(0.5, 0.5, 0.5, 'map', texture);

  //adiciona uma luz ao ambiente, responsável por iluminar a cena inteira
  const ambient = new THREE.AmbientLight('#404040', 4);
  scene.add(ambient);

  // Cria uma luz
  const light = new THREE.PointLight('#FFF', 1, 100);
  light.position.set(0, 0, 20);
  scene.add(light);

  // Cria os obstáculos
  // for (let i = 0; i < 5; i++) {
  //   const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
  //   const obstacleMaterial = new THREE.MeshBasicMaterial({ color: '#F00' });
  //   const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  //   obstacle.position.x = (Math.random() - 0.5) * 20;
  //   obstacle.position.y = (Math.random() - 0.5) * 20;
  //   obstacle.position.z = (Math.random() - 0.5) * 20;
  //   obstacles.push(obstacle);
  //   scene.add(obstacle);
  // }

  // Cria os obstáculos, de qualquer forma e insere na tela em posições randômicas
  const createObstacle = (geometry) => {
    for (let i = 0; i < 5; i++) {
      geometry.position.x = (Math.random() - 0.5) * 5;
      geometry.position.y = (Math.random() - 0.5) * 5;
      geometry.position.z = (Math.random() - 0.5) * 5;
      scene.add(geometry);
    }
  }

  createObstacle(sphere);
  createObstacle(rectangle);
  createObstacle(cube);
  createObstacle(texturedCube);
  
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

  loadHouse();
};

const loadHouse = () => {
  let loader = new THREE.GLTFLoader();
    loader.load('./model/casa-duplex/scene.gltf', function(gltf){
        scene.add(gltf.scene);
        house = gltf.scene.children[0]; // atribuindo à variável house o objeto presente na cena
       animate();
    });
}

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

  if(house){
    house.position.z = -10;
    house.position.x = -15;
    house.position.y = -10;
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