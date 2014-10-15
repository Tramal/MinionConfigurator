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
createPlane();
loadMinion();
addLights();
render();

function initRenderer() {
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
        this.showGoggles = true;
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

    var minionConfigurationFolder = gui.addFolder('Minion configurator');
    minionConfigurationFolder.open();

    var bodyColorChooser = minionConfigurationFolder.addColor(configuration, 'bodyColor').name("Minion color").listen();
    bodyColorChooser.onChange(function (colorValue) {
        minion.body.children[0].material.materials[0].color = new THREE.Color(colorValue);
        render();
    });

    var jeansColorChooser = minionConfigurationFolder.addColor(configuration, 'jeansColor').name("Jeans color").listen();
    jeansColorChooser.onChange(function (colorValue) {
        minion.jeans.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var handsColorChooser = minionConfigurationFolder.addColor(configuration, 'handsColor').name("Hands color").listen();
    handsColorChooser.onChange(function (colorValue) {
        minion.hands.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var bootsColorChooser = minionConfigurationFolder.addColor(configuration, 'bootsColor').name("Boots color").listen();
    bootsColorChooser.onChange(function (colorValue) {
        minion.boots.children[0].material.color = new THREE.Color(colorValue);
        render();
    });

    var visibleGogglesCheckbox = minionConfigurationFolder.add(configuration, 'showGoggles').name("Brille anzeigen").listen();
    visibleGogglesCheckbox.onChange(function (checked) {
        minion.goggles.visible = checked;
        render();
    });

    gui.open();
}

function initCamera() {
    camControls.damping = 0.2;
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;
    camControls.maxDistance = 300;
    camControls.addEventListener('change', render);
}

function createPlane() {
    var planeGeometry = new THREE.PlaneGeometry(80, 80, 10, 10);
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);
}

function loadMinion() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('minion.dae', function (collada) {
        collada.scene.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh) {
                var animation = new THREE.Animation(child, child.geometry.animation);
                animation.play();
                camera.lookAt(child.position);
            }
        });
        minion = collada.scene;
        minion.goggles = minion.getObjectById("goggles");
        minion.body = minion.getObjectById("body");
        minion.jeans = minion.getObjectById("jeans");
        minion.hands = minion.getObjectById("hands");
        minion.boots = minion.getObjectById("boots");
        minion.goggles.children[0].material.materials[1].transparent = true;
        minion.goggles.children[0].material.materials[1].opacity = 0.2;

        minion.position.set(0, 0, 0);
        minion.scale.set(10, 10, 10);
        minion.castShadow = true;
        scene.add(minion);
        camControls.panUp(10);
        camControls.update();
        render();
    });
}

function addLights() {
    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

// add spotlight
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );

    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;

    scene.add( spotLight );

// add headlight
    headLight.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(headLight);
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