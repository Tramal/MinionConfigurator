var minion;
var plane;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var headLight = new THREE.PointLight(0x888888, 1.0);
var camControls = new THREE.OrbitControls(camera, renderer.domElement);

initRenderer();
initMenu();
initCamera();
window.addEventListener('resize', onWindowResize, false);
addLights();
loadMinion();

function initRenderer() {
    renderer.setClearColor("#0066FF", 1);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    var webglContainer = document.getElementById('webgl-container');
    webglContainer.appendChild(renderer.domElement);
}

function initMenu() {
    var minionColor = document.getElementById("minion-color");
    minionColor.addEventListener("change", function(){ changeColor(minionColor[minionColor.selectedIndex].value,  minion.body.children[0].material.materials[0])});

    var jeansColor = document.getElementById("jeans-color");
    jeansColor.addEventListener("change", function(){ changeColor(jeansColor[jeansColor.selectedIndex].value,  minion.jeans.children[0].material)});

    var glovesColor = document.getElementById("gloves-color");
    glovesColor.addEventListener("change", function(){ changeColor(glovesColor[glovesColor.selectedIndex].value,  minion.hands.children[0].material)});

    var shoesColor = document.getElementById("shoes-color");
    shoesColor.addEventListener("change", function(){ changeColor(shoesColor[shoesColor.selectedIndex].value,  minion.boots.children[0].material)});

    var lensesColor = document.getElementById("lenses-color");
    lensesColor.addEventListener("change", function(){ changeColor(lensesColor[lensesColor.selectedIndex].value,  minion.goggles.children[0].material.materials[1])});

    var showGoggles = document.getElementById("show-goggles");
    showGoggles.addEventListener("change", function(){
        minion.goggles.visible = showGoggles.checked;
        minion.goggle.visible = showGoggles.checked;
    });

    var eyesNumber = document.getElementById("eyes-number");
    eyesNumber.addEventListener("change", function(){
        if (eyesNumber[eyesNumber.selectedIndex].value == 1) {
            minion.oneEye.visible = true;
            minion.twoEye.visible = false;
        }
        else {
            minion.oneEye.visible = false;
            minion.twoEye.visible = true;
        }
    });
}

function initCamera() {
    camControls.damping = 0.2;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 20;
    camControls.maxDistance = 30;
    camControls.addEventListener('change', render);
}

function createPlane() {
    var planeGeometry = new THREE.PlaneGeometry(80, 80, 10, 10);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x009933
});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);
}

function loadMinion() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('model/minion.dae', function (collada) {
        minion = collada.scene;
        minion.twoEye = minion.getObjectById("twoEye");
        minion.oneEye = minion.getObjectById("oneEye");
        minion.body = minion.getObjectById("body");
        minion.jeans = minion.getObjectById("jeans");
        minion.hands = minion.getObjectById("hands");
        minion.boots = minion.getObjectById("boots");
        minion.goggles = minion.twoEye.getObjectById("goggles");
        minion.goggle = minion.oneEye.getObjectById("goggle");

        minion.body.children[0].material.materials[0].shininess = 10;
        minion.jeans.children[0].material.shininess = 10;
        minion.goggles.children[0].material.materials[1].transparent = true;
        minion.goggles.children[0].material.materials[1].opacity = 0.5;

        minion.oneEye.visible = true;
        minion.twoEye.visible = false;

        minion.position.set(0, 0, 0);
        camControls.panUp(10);
        camControls.update();

        scene.add(minion);
        createPlane();
        document.getElementById('loading').style.display = "none";
        animate();
    });
}

function addLights() {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 10, 10, 10 );

    scene.add( spotLight );

    headLight.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(headLight);
}

function animate() {
    requestAnimationFrame(animate);
    minion.rotation.y += 0.01;
    render();
}

function render() {
    headLight.position.set(camera.position.x, camera.position.y, camera.position.z);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    render();
}

function changeColor(color, material) {
    material.color = new THREE.Color(color);
    render();
}