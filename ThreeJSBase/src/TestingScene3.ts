import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import Input from "./Input.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import AssetsManager from "./AssetsManager.js";
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { Vector3, Material, Color, Vector2 } from "../node_modules/three/src/Three.js";
// import { Pathfinding } from '../modules/three-pathfinding.js';


export default class TestingScene3 extends IScene {
    axisHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
    cameraHelper: THREE.CameraHelper;
    controls: OrbitControls;

    raycaster = new THREE.Raycaster();

    plane: THREE.Object3D;
    navmesh: THREE.Mesh;
    //@ts-ignore
    pathfinder = new threePathfinding.Pathfinding();
    //@ts-ignore
    pathfinderHelper = new threePathfinding.PathfindingHelper();

    objects = [];

    player: THREE.Object3D;

    time: number = 0;
    time2 = 0;
    cd: number = 1;
    cd2 = 1;
    needMove: boolean = false;
    needRotation: boolean = false;
    posInit;
    posFinal;
    speed = 10;
    speedRotation = Math.PI * 2;

    rotationInit: THREE.Quaternion;
    targetQuaternion = new THREE.Quaternion();
    ZONE = 'level1';

    path;
    times;
    index;

    constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
        super(container, renderer);
        this.usePostProcessing = false;
        this.Init();
    }


    Init() {
        this.LoadingAssets();
        this.CreateScene();
        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();
        this.CreatePostProcessing();
    }

    LoadingAssets() {
        AssetsManager.GetInstance().LoadObject("models/NavMesh/sceneTest.glb");
        AssetsManager.GetInstance().LoadObject("models/NavMesh/NavMeshTest.glb");
    }


    CreateMovimentation() {
        this.renderer.domElement.addEventListener('click', this.onClick, false);
        this.scene.add(this.pathfinderHelper);

        let a = new THREE.Vector3(0,0,0);

        let b = new THREE.Vector3(2,0,0);

        //@ts-ignore
        this.pathfinder.setZoneData(this.ZONE, threePathfinding.Pathfinding.createZone(this.navmesh.geometry));        
            
    }

    resetMovement(){
        this.needMove = false;
        this.needRotation = false;
        this.time = 0;
        this.time2 = 0;
        this.index = 0;
    }

    onClick = (event) => {
        const mouse = {
            x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        }

        // console.log(mouse);
        
        this.resetMovement();

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {


            this.times = [];
            const p = intersects[0].point;            
            let pos = this.player.position;

            this.posInit = new THREE.Vector3(pos.x, pos.y, pos.z);
            this.posFinal = new THREE.Vector3(p.x, p.y, p.z);

            console.log("pI " + this.posInit.x + " " + this.posInit.y + " " + this.posInit.z);
            console.log("pF " + this.posFinal.x + " " + this.posFinal.y + " " + this.posFinal.z);
            
            const groupID = this.pathfinder.getGroup(this.ZONE, this.posInit);
            this.path = this.pathfinder.findPath(this.posInit, this.posFinal, this.ZONE, groupID);

            if (this.path) {
                this.pathfinderHelper.setPlayerPosition(this.posInit).setTargetPosition(this.posFinal);
                this.pathfinderHelper.setPath(this.path);
                let distance = 0;

                this.path = [this.posInit].concat(this.path);

                for (let i = 0; i < this.path.length-1; i++) {
                    let d = this.path[i].distanceTo(this.path[i + 1]);
                    distance += d;
                    this.times.push(d/this.speed);
                }

                // console.log(this.times);
                
                this.cd = Math.abs(distance / this.speed);
                // console.log(this.cd);
                this.needMove = true;

            }

            
            // new TWEEN.Tween(modelMesh.position)
            //     .to({
            //         x: p.x,
            //         y: p.y,
            //         z: p.z
            //     }, 1000 / 2.2 * distance) //walks 2 meters a second * the distance
            //     .onUpdate(() => {
            //         controls.target.set(
            //             modelMesh.position.x,
            //             modelMesh.position.y + 1,
            //             modelMesh.position.z)
            //         light1.target = modelMesh;
            //         light2.target = modelMesh;
            //     })
            //     .start()
            //     .onComplete(() => {
            //         setAction(animationActions[2])
            //         activeAction.clampWhenFinished = true;
            //         activeAction.loop = THREE.LoopOnce
            //     })
        }
    }

    CreateScene() {
        this.scene = new THREE.Scene();
        this.scene.add(this.axisHelper);
        // this.scene.add(this.plane);
        // this.objects.push(this.plane);
        // this.plane.rotateX(-Math.PI / 2)
        // this.plane.receiveShadow = true;

        var geo = new THREE.IcosahedronBufferGeometry(1, 4);
        var geoC = new THREE.IcosahedronBufferGeometry(1, 4);

        var color = new THREE.Color(0x00ff00);
        var color2 = new THREE.Color(0xff0000);
        var material = new THREE.MeshBasicMaterial({ color: color });
        var materialC = new THREE.MeshBasicMaterial({ color: color2 });

        this.player = new THREE.Mesh(geo, material);
        let c = new THREE.Mesh(geoC, materialC);
        this.player.add(c);
        c.position.z = 1;
        // this.player.position.y = 1;
        c.scale.set(0.2, 0.2, 0.2);

        this.player.castShadow = true;
        this.scene.add(this.player);
    }


    CreatePostProcessing() {
        var renderScene = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderScene);
    }
p1;
p2;
    Update(dt: number) {

        if (!AssetsManager.GetInstance().loading) {
            if (!this.plane) {
                this.plane = AssetsManager.GetInstance().LoadObject("models/NavMesh/sceneTest.glb").scene.children[0];
                this.plane.receiveShadow = true;
                this.plane.castShadow = true;
                // (<THREE.Mesh>this.plane).material = new THREE.MeshBasicMaterial({ color: "grey", wireframe: true });

                this.navmesh = <THREE.Mesh>AssetsManager.GetInstance().LoadObject("models/NavMesh/NavMeshTest.glb").scene.children[0];

                const navWireframe = new THREE.Mesh(this.navmesh.geometry, new THREE.MeshBasicMaterial({
					color: 0x808080,
					wireframe: true
                }));

                this.navmesh.position.y = 0;

                this.scene.add(navWireframe);
                
                this.objects.push(this.navmesh);
                this.scene.add(this.plane);
                this.CreateMovimentation();

            }



        }


        if (this.needRotation) {

            if(this.time2 == 0){
                this.p1 = this.path[this.index];
                this.p2 = this.path[this.index+1];

                const rotationMatrix = new THREE.Matrix4();
                rotationMatrix.lookAt(this.p2, this.p1, this.player.up);

                this.rotationInit = this.player.quaternion;
                this.targetQuaternion.setFromRotationMatrix(rotationMatrix);

                this.cd2 = this.rotationInit.angleTo(this.targetQuaternion) / this.speedRotation;
            }

            this.time2 += dt;
            let quaternion = this.rotationInit.slerp(this.targetQuaternion, this.time2 / this.cd2);

            this.player.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

            if (this.time2 >= this.cd2) {
                this.time2 = 0;
                this.needRotation = false;
            }
        }

        if (this.needMove) {
            
            if(this.time == 0 ){
                
                this.time2 = 0;
                this.needRotation = true;

                this.p1 = this.path[this.index];
                this.p2 = this.path[this.index+1];
                
                console.log(this.p1);
                console.log(this.p2);
                this.cd = this.p1.distanceTo(this.p2) / this.speed;
                console.log(this.p1.distanceTo(this.p2) / this.speed);
            }

            this.time += dt;
            let t = this.time / this.cd;
            
            let p1 = new Vector3(this.p1.x, this.p1.y, this.p1.z);
            let p2 = new Vector3(this.p2.x, this.p2.y, this.p2.z);

            let pos = p1.lerp(p2, t);
           this.player.position.set(pos.x, pos.y, pos.z);
            // console.log(pos);

            if(t >= 1){
                this.index++;
                this.time = 0;
                console.log("trocou");
                
                if(this.index >= this.times.length){
                    this.needMove = false;
                }

                
            }           

        }

        if (Input.GetInstance().IsKeyPressed("a")) {
            this.usePostProcessing = !this.usePostProcessing;
            console.log("Enabling PostProcessing: " + this.usePostProcessing);
        }
    }

    CreateCamera() {
        const fov = 40; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 1; // the near clipping plane
        const far = 2000; // the far clipping plane

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set(0, 1, 20);

        window.addEventListener("resize", () => {
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth / this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        })
    }

    CreateLights() {

        let light = new THREE.DirectionalLight();
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 40;
        light.position.y = 20;

        let scaleX = 25;

        light.shadow.camera.left = -scaleX;
        light.shadow.camera.right = scaleX;
        light.shadow.camera.bottom = -scaleX;
        light.shadow.camera.top = scaleX;
        this.scene.add(light);

        this.cameraHelper = new THREE.CameraHelper(light.shadow.camera)
        this.scene.add(this.cameraHelper);
    }

    CreateControls() {
        this.controls = new OrbitControls(this.camera, this.container);
        this.controls.enablePan = false;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            RIGHT: THREE.MOUSE.LEFT,
            MIDDLE: THREE.MOUSE.MIDDLE
        }
    }
}
