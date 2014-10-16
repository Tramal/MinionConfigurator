var minion;
var configuration;
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
    configuration = new function () {
        this.bodyColor = 0xEBC700;
        this.jeansColor = 0x0051E7;
        this.handsColor = 0x232408;
        this.bootsColor = 0x232408;
        this.gogglesColor = 0xE7E7E7;
        this.showGoggles = true;
        this.eye = "1";
    };

    var gui = new dat.GUI({
        autoPlace: false
    });

    var guiContainer = document.getElementById('gui-container');
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '150px';
    gui.domElement.style.left = '5px';
    gui.domElement.style.height = '400px';
    guiContainer.appendChild(gui.domElement);

    var colorsFolder = gui.addFolder('Colors');
    var eyesFolder = gui.addFolder('Eyes');
    colorsFolder.open();

    var bodyColorChooser = colorsFolder.addColor(configuration, 'bodyColor').name("Minion").listen();
    bodyColorChooser.onChange(function (colorValue) {
        minion.body.children[0].material.materials[0].color = new THREE.Color(colorValue);
        render();
    });

    var jeansColorChooser = colorsFolder.addColor(configuration, 'jeansColor').name("Jeans").listen();
    jeansColorChooser.onChange(function (colorValue) {
        minion.jeans.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var handsColorChooser = colorsFolder.addColor(configuration, 'handsColor').name("Gloves").listen();
    handsColorChooser.onChange(function (colorValue) {
        minion.hands.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var bootsColorChooser = colorsFolder.addColor(configuration, 'bootsColor').name("Shoes").listen();
    bootsColorChooser.onChange(function (colorValue) {
        minion.boots.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var gogglescolorChooser = colorsFolder.addColor(configuration, 'gogglesColor').name("Lenses").listen();
    gogglescolorChooser.onChange(function (colorValue) {
        minion.goggles.children[0].material.materials[1].color = new THREE.Color(colorValue);
        render();
    });

    var visibleGogglesCheckbox = eyesFolder.add(configuration, 'showGoggles').name("Show goggles").listen();
    visibleGogglesCheckbox.onChange(function (checked) {
        minion.goggles.visible = checked;
        minion.goggle.visible = checked;
        render();
    });

    var eyeText = eyesFolder.add(configuration, 'eye', ['1', '2']).name("Number of eyes").listen();
    eyeText.onChange(function (value) {
        if (value == 1) {
            minion.oneEye.visible = true;
            minion.twoEye.visible = false;
        }
        else {
            minion.oneEye.visible = false;
            minion.twoEye.visible = true;
        }
        render();
    });

    gui.open();
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
        minion.goggle = minion.twoEye.getObjectById("goggle");

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

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 300;

    scene.add( spotLight );
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