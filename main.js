let container, camera, renderer, scene, house;

const init = () => {
    
    container = document.querySelector('.scene');

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#c3c3c3');

    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 300);
    camera.position.set(0, 0, 50);

    //adiciona uma luz ao ambiente, responsável por iluminar a cena inteira
    const ambient = new THREE.AmbientLight('#404040', 4);
    scene.add(ambient);

    // adiciona uma luz direcional ao objeto da cena
    const light = new THREE.DirectionalLight('#FFF', 3);
    light.position.set(10, 10, 10); // posição da luz
    scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); //criando o renderer
    renderer.setSize(container.clientWidth, container.clientHeight);     //tamanho do renderizador igual ao tamanho da janela
    renderer.setPixelRatio(window.devicePixelRatio);  //definindo proporção de pixel igual a proporção de pixel do dispositivo
    container.appendChild(renderer.domElement); //adicionando o renderer à página html

    //carregar modelo 3d
    let loader = new THREE.GLTFLoader();
    loader.load('./model/casa-duplex/scene.gltf', function(gltf){
        scene.add(gltf.scene);
        house = gltf.scene.children[0]; // atribuindo à variável house o objeto presente na cena
       animate();
    });
}

function animate() {
    requestAnimationFrame(animate);
    house.rotation.z += 0.005; // rotaciona a casa
    renderer.render(scene, camera); // renderiza a camera e a cena
}

init();

// lidar com redimensionamento da tela
function changeResize () {

    // definindo que o aspecto da câmera (proporção) será o tamanho da janela
    camera.aspect = container.clientWidth / container.clientHeight;

    // atualizar a matrix de projeção, para não deformar o objeto da cena
    camera.updateProjectionMatrix();

    //manter o tamanho do renderizador igual ao tamanho da janela, a medida que a janela muda de tamanho
    renderer.setSize(container.clientWidth, container.clientHeight);
}

//ouvir o evento de redimensionamento da janela
window.addEventListener('resize', changeResize);