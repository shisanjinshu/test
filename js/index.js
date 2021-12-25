var effectController;
var ambientLight;
var view;
var width;
var height;
var scene;
//心心围绕飞行的中心点
var flyCenter={x:0,y:0,z:0};
//是否开启围绕中心点飞行模型
var isFlyCenter=true;
//是否开启心型飞行模型
var isFlyHert=true;
//贴图资源数组
var imgArray=[];

function initScene() {
	view = document.getElementById("canvas-frame");
	width = view.clientWidth;
	height = view.clientHeight;
	console.log("宽长",width,height);
	scene = new THREE.Scene();

	scene.background = new THREE.CubeTextureLoader()
		.setPath('skybox/')
		.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
}
var camera;

function initCamera() {
	camera=new THREE.PerspectiveCamera(45,width/height,1,2000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 200;
	window.camera=camera;
}

var pX,pY,pX1,pY1;
function initScreenSize(){
	//计算摄像机200深度处的长宽
	pY = Math.tan(Math.PI/8)*200;
	pX = pY*(width/height);
	//计算摄像机10深度处的长宽
	pY1 = Math.tan(Math.PI / 8) * 10;
	pX1 = pY1 * (width / height);
}

var renderer;

function initRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		preserveDrawingBuffer:true
	});
	renderer.setSize(width, height);
	renderer.setClearColor(0xFFFFFF);
	//时，要看的很清楚，渲染像素比率设置为标准屏幕像素
	renderer.setPixelRatio(window.devicePixelRatio);
	view.appendChild(renderer.domElement);
}

function initLight() {
	ambientLight = new THREE.AmbientLight(0x333333); // 0.2
	scene.add(ambientLight);
	var light1 = new THREE.DirectionalLight(0xFFFFFF, 3.0);
	var light2 = new THREE.DirectionalLight(0xFFFFFF, 3.0);
	light2.position.set(0, -1, -1);
	scene.add(light1);
	scene.add(light2);
}

var mixers = [];
var clock = new THREE.Clock();

function initCube() {
	var counter = document.getElementById("counter");
	createHeart(loader,mixers,scene,{fly:true,position:{x:20,y:0,z:0},rotation:{x:0,y:Math.PI/2,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-20,y:0,z:0},rotation:{x:0,y:-Math.PI/2,z:0}});
	
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:90,z:10},rotation:{x:-Math.PI/4,y:0,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:90,z:-10},rotation:{x:Math.PI/4,y:Math.PI,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:-90,z:10},rotation:{x:Math.PI/4,y:0,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:-90,z:-10},rotation:{x:-Math.PI/4,y:Math.PI,z:0}});
	
	createHeart(loader,mixers,scene,{fly:true,position:{x:10,y:90,z:0},rotation:{x:0,y:Math.PI/2,z:-Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-10,y:90,z:0},rotation:{x:0,y:-Math.PI/2,z:Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:10,y:-90,z:0},rotation:{x:0,y:Math.PI/2,z:Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-10,y:-90,z:0},rotation:{x:0,y:-Math.PI/2,z:-Math.PI/4}});
	
	createHeart(loader,mixers,scene,{fly:true,position:{x:20,y:0,z:0},rotation:{x:0,y:Math.PI/2,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-20,y:0,z:0},rotation:{x:0,y:-Math.PI/2,z:0}});
	
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:90,z:10},rotation:{x:-Math.PI/4,y:0,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:90,z:-10},rotation:{x:Math.PI/4,y:Math.PI,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:-90,z:10},rotation:{x:Math.PI/4,y:0,z:0}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:0,y:-90,z:-10},rotation:{x:-Math.PI/4,y:Math.PI,z:0}});
	
	createHeart(loader,mixers,scene,{fly:true,position:{x:10,y:90,z:0},rotation:{x:0,y:Math.PI/2,z:-Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-10,y:90,z:0},rotation:{x:0,y:-Math.PI/2,z:Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:10,y:-90,z:0},rotation:{x:0,y:Math.PI/2,z:Math.PI/4}});
	createHeart(loader,mixers,scene,{fly:true,position:{x:-10,y:-90,z:0},rotation:{x:0,y:-Math.PI/2,z:-Math.PI/4}});

	createRqq(loader,scene,{position:{x:-1000,y:-500,z:-1000},rotation:{x:0,y:Math.PI/2,z:0}});
	createRqq(loader,scene,{position:{x:-1000,y:-500,z:1000},rotation:{x:0,y:Math.PI/2,z:0}});
	createRqq(loader,scene,{position:{x:1000,y:-500,z:-1000},rotation:{x:0,y:Math.PI/2,z:0}});
	createRqq(loader,scene,{position:{x:1000,y:-500,z:1000},rotation:{x:0,y:Math.PI/2,z:0}});
	
	createHertBtn(loader,scene);
	
	createHertBtn1(loader,scene);
	
	createMf(loader,scene);
}

window.cubes=[];

var stats; 
 function initStats() { 
 stats = new Stats(); 
 stats.domElement.style.position = 'absolute';
 stats.domElement.style.left = '0px';
 stats.domElement.style.top = '0px';
 document.body.appendChild(stats.domElement); 
 }
 
 //控制旋转工具
 var control;
 function initControl()
 {
 	control=new THREE.TrackballControls(camera);
 	control.rotateSpeed = 0.1;
 	control.zoomSpeed = 2;
 	control.panSpeed = 0.5;
 	control.noZoom = false;
 	control.noPan = false;
 	control.staticMoving = false;
 	control.dynamicDampingFactor = 0;
 }
 
function animat() {
	//requestAnimationFrame(func)是一个js原生函数，作用是在浏览器在进行下一帧渲染时会调用func函数
	requestAnimationFrame(animat);
	// 重复播放动画
	var delta = clock.getDelta();
	for (var i = 0; i < mixers.length; i++) {
		mixers[i].update(delta);
	}
	FLY.update();
	TWEEN.update();
	//stats.update();
	if(isFreeEye){
		control.update();
	}
	//渲染器渲染，渲染指定场景，以指定相机去渲染
	renderer.render(scene, camera);
}
//isFreeEye=true;

function threeStart() {
	initImgArray();
	initScene();
	initRenderer();
	initCamera();
	initScreenSize();
	initLight();
	initCube();
	//initStats();
	animat();
	initPoints();
	intHandIcon();
	initControl();
}