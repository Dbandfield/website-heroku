"use strict";

// var SimpleReverb = require("simple-reverb");

var logger = new Logger(document.getElementById('log1'),
                        document.getElementById('log2'),
                        document.getElementById('log3'));

logger.log("Start!");

var camera;
var listener;
var scene;
var renderer;
var controls;

var raycaster;

var gardenSize = 800;

var restartTmr = 0;
var restartTmrMax = 1800; // 30min

var firstNotes = [];
firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);
firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);
firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);


var overlay = document.getElementById('overlay');
var instr = document.getElementById('instructions');
var display3D = document.getElementById('display3D');
var pigMdl = null;
var pigs = [];
var floor;
var nextGender = "female";
var heartMdl = null;

var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function(event)
    {
        if (document.pointerLockElement === element ||
            document.mozPointerLockElement === element ||
            document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            overlay.style.display = 'none';
        } else {
            controls.enabled = false;
            velocity.set(0, 0, 0);
            moveLeft = false;
            moveRight = false;
            moveForward = false;
            moveBackward = false;
            overlay.style.display = 'table';
        }
    };

    var pointerlockerror = function(event) {
        console.log("Pointer lock error!");
    };
    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    overlay.addEventListener('click', function(event) {

        element.requestPointerLock = element.requestPointerLock ||
            element.mozRequestPointerLock ||
            element.webkitRequestPointerLock;

        element.requestPointerLock();
    }, false);

} else {
    instr.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

var controlsEnabled = true;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

init();
animate();



function init()
{
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    listener = new THREE.AudioListener();
    camera.add(listener);
    scene = new THREE.Scene();

    // floor
    var worldWidth = 50;
    var worldDepth = 50;
    var data = generateHeight(worldWidth, worldDepth);
    var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, worldWidth - 1,
        worldDepth - 1);
    floorGeometry.rotateX(-Math.PI / 2);
    floorGeometry.translate(0, -50000, 0);

    var vertices = floorGeometry.attributes.position.array;
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        vertices[j + 1] = data[i] * 1;
        vertices[j + 1] += Math.random() * 10;
    }

    var floorMaterial = new THREE.MeshLambertMaterial({
        //color: 0x444466
        //color: 0x000000
        color: 0xccdddd
        });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    // model
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {};

    var pigLoader = new THREE.ObjectLoader();
    pigLoader.load('data/models/json/pig/pig.json', function(_obj) {
        _obj.traverse(function(_child) {
            if (_child instanceof THREE.SkinnedMesh) {
                    pigMdl = _child.clone();
            }
        })
    });

    var heartLoader = new THREE.JSONLoader();
    heartLoader.load('data/models/json/heart/heart.json', function(_obj) {
        heartMdl = _obj.clone();
        //console.log(heartMdl);
        // _obj.traverse(function(_child) {
        //     console.log(_obj);
        //
        //     //if (_child instanceof THREE.Mesh) {
        //             //heartMdl = _child.clone();
        //     //}
        //     heartMdl = _obj.clone();
        //     console.log(heartMdl);
        // })
    });


    scene.background = new THREE.Color(0xddddff);
    scene.fog = new THREE.Fog(0x555566, 10, 500);
    //var light = new THREE.HemisphereLight(0xbb8888, 0x001100, 1);
    var light = new THREE.HemisphereLight(0xffffff, 0x112255, 1);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    var onKeyDown = function(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    };
    var onKeyUp = function(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
            case 69:
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;

                element.requestPointerLock();
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    display3D.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    setTimeout(function()
        {
            console.log("Requesting pointerlock");
            var element = document.body;
            element.requestPointerLock = element.requestPointerLock ||
                element.mozRequestPointerLock ||
                element.webkitRequestPointerLock;

            element.requestPointerLock();
        }, 10000);
}

function generateHeight(width, height) {
    var size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        quality = 1,
        z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < size; i++) {
            var x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }

        quality *= 5;
    }

    return data;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate);

    var time = performance.now();
    var delta = (time - prevTime) / 1000;
    prevTime = time;

    restartTmr += delta;

    if(restartTmr > restartTmrMax)
    {
        logger.log("Restarting Simulation");
        console.log("restarting");
        restartTmr = 0;
        for(var p in pigs)
        {
            pigs[p].kill();
        }

        //change tune
        firstNotes = [];
        firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);
        firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);
        firstNotes.push(NOTES.noteArray[Math.floor(Math.random() * NOTES.noteArray.length)]);
    }

    var params = [];

    // make new pigs if necessary
    if(pigMdl)
    {
        if(pigs.length < 3)
        {
            for (var i = 0; i < 6; i++)
            {
                pigs.push(new Pig(pigMdl.clone(), listener, scene, floor, heartMdl));
            }
        }
    }

    // remove dead
    var deadPigs = [];
    for (var p in pigs)
    {
        if(pigs[p].getDead())
        {
            deadPigs.push(pigs[p]);
        }
    }

    for(var i in deadPigs)
    {
        logger.log("An animal died.");
        pigs.splice(pigs.indexOf(deadPigs[i]), 1);
    }


    for (var p in pigs) {
        pigs[p].update(delta);
        params.push(pigs[p].getBaby());

        if (pigs[p].getLookingForMate()) {
            //console.log("Pig " + p + " is looking for mate");
            for (var pp in pigs) {
                if (pigs[pp].getLookingForMate()) {
                    //console.log("Pig " + pp + " is also looking for mate. ");

                    if (pigs[pp].getGender() != pigs[p].getGender()) {
                        console.log("Pairing " + p + " and " + pp);
                        pigs[p].setMate(pigs[pp]);
                        pigs[pp].setMate(pigs[p]);
                        break;
                    } else {
                        //console.log("Pig " + pp + " is different gender");
                    }
                } else {
                    //console.log("Pig " + pp + " is not looking for mate. ");

                }
            }
        } else {}
    }

    for (var p in params)
    {
        if (params[p])
        {
            pigs.push(new Pig(pigMdl.clone(),listener, scene, floor, heartMdl, params[p]));
        }
    }

    if (controlsEnabled === true)
    {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;
        var intersections = raycaster.intersectObject(floor);
        var onObject = intersections.length > 0;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);

        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject) {
            if (intersections[0].distance < 5) {
                velocity.y = 0;
            }
        } else {
            velocity.y = 50;
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        if(controls.getObject().position.x < -(gardenSize)) controls.getObject().position.x =  -(gardenSize/2);
        if(controls.getObject().position.x >  (gardenSize)) controls.getObject().position.x =    (gardenSize/2);
        if(controls.getObject().position.z < -(gardenSize)) controls.getObject().position.z =  -(gardenSize/2);
        if(controls.getObject().position.z >  (gardenSize)) controls.getObject().position.z =    (gardenSize/2);


        // if ( controls.getObject().position.y < 10 )
        // {
        // 	velocity.y = 0;
        // 	controls.getObject().position.y = 10;
        // 	canJump = true;
        // }

    }

    renderer.render(scene, camera);
}
