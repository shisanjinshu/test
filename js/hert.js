/**根据数组元素创建对象
 * @param {Array} arr参数数组，数组每个元素代表要创建对象的属性
 * @return {Array} 返回一个数组，包含创建完成的元素
 */
var createHeart = function(loader, mixers, scene, obj) {
	let cube = undefined;
	loader.load('model/hert.glb', function(gltf) {
		//获得对象
		cube = gltf.scene;
		cube.position.x = obj.position.x;
		cube.position.y = obj.position.y;
		cube.position.z = obj.position.z;
		cube.rotation.x = obj.rotation.x;
		cube.rotation.y = obj.rotation.y;
		cube.rotation.z = obj.rotation.z;
		scene.add(cube);
		var mixer = new THREE.AnimationMixer(cube);
		var mixer = new THREE.AnimationMixer(cube.children[2]);
		mixer.clipAction(gltf.animations[0]).setDuration(1).play();
		mixers.push(mixer);
		if (obj.fly) {
			window.cubes.push(cube);
			FLY.Fly(cube);
		}
	}, undefined, function(error) {
		console.error(error);
	});
}

var createRqq = function(loader, scene, obj) {
	let cube = undefined;
	loader.load('model/rqq.glb', function(gltf) {
		//获得对象
		cube = gltf.scene;
		window.rqq=cube;
		//cube.children[1].material.color.set("#ffff00");
		cube.children[2].material.color.set("#ffff00");
		cube.position.x = obj.position.x;
		cube.position.y = obj.position.y;
		cube.position.z = obj.position.z;
		cube.rotation.x = obj.rotation.x;
		cube.rotation.y = obj.rotation.y;
		cube.rotation.z = obj.rotation.z;
		scene.add(cube);
		setTimeout(function() {
			let tween = new TWEEN.Tween(cube.position);
			tween.to({
				x: 0,
				y: 1000,
				z: 0
			}, 5000);
			tween.onComplete(function() {
				cube.position.x = obj.position.x;
				cube.position.y = obj.position.y;
				cube.position.z = obj.position.z;
			});
			tween.chain(tween);
			tween.start();
		}, 5000 * Math.random());
	}, undefined, function(error) {
		console.error(error);
	});
}

var imgLoader = new THREE.TextureLoader();
var loadImg = function(imgPath, func) {
	imgLoader.load(
		imgPath,
		func,
		function(xhr) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function(xhr) {
			console.log('An error happened');
		}
	);
}

/* 初始化贴图资源数组 */
var initImgArray = function(func) {
	var imgPaths = [];
	for(var i=1;i<=40;i++){
		imgPaths.push(i+".jpg");
	}
	//将数组打乱
	for(var i=0;i<imgPaths.length+10;i++){
		var rdm = Math.floor(Math.random()*imgPaths.length)
		imgPaths.push(imgPaths[rdm])
		imgPaths.splice(rdm,1)
	}

	var loadedCount = 0;
	for (var item of imgPaths) {
		item = "image/" + item;
		loadImg(item, function(img) {
			imgArray.push(img);
			if (++loadedCount >= imgPaths.length) {
				console.log("贴图资源加载完毕");
				imgsLoaded=true;
				if (func) {
					func(imgArray);
				}
			}
		});
	}
}

//初始化声音
var initMusic = function(cube) {
	/* var audio= new Audio("/music/bak.mp3");
	audio.play(); */
}

/**
 * 开场动画
 * 1:使相机从原点向屏幕后退700坐标
 * 2:等待5秒，停止心心自由飞行，让所有心心按心型轨道飞行
 * 3:所有心心螺旋式直冲云霄
 * 4:所有心心飞到热气球四周均匀距离位置
 * 5:所有心心和热气球一起垂直下降到原点位置
 * 6:所有心心回归到初始位置，开始自由飞行
 */
var initStartAnimationIsInit=false;
var initStartAnimation = function() {
	//删除相册、按钮、魔方
	delAllUi();
	console.log("开始心型动画");
	//停止自由飞行
	FLY.flys = [];
	//心心轨道曲线
	var curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(20, 0, 0),
		new THREE.Vector3(-40, 85, 0),
		new THREE.Vector3(-90, 85, 0),
		new THREE.Vector3(-120, 45, 0),
		new THREE.Vector3(-100, -25, 0),
		new THREE.Vector3(0, -95, 0),
		new THREE.Vector3(100, -25, 0),
		new THREE.Vector3(120, 45, 0),
		new THREE.Vector3(90, 85, 0),
		new THREE.Vector3(40, 85, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-60, -20, 0)
	], false /*是否闭合*/ );
	//遍历数组中的所有心心，给每个心心都创建一个补间动画，包括起始位置和结束位置
	var timeDarly = 0;
	let jiaodu = Math.PI / cubes.length;
	let arr1 = cubes.slice(0, cubes.length / 2 - 1);
	let arr2 = cubes.slice(cubes.length / 2 - 1);
	for (let index in cubes) {
		let item = cubes[index];
		item.lookAt(0,0,0);
		let itemPositionTween = new TWEEN.Tween(item.position);
		itemPositionTween.to({
			x: 0,
			y: 0,
			z: 0
		}, 3000 + timeDarly);
		let itemRotationTween = new TWEEN.Tween(item.rotation);
		itemRotationTween.to({
			x: 0,
			y: 0,
			z: 0
		}, 4000 + timeDarly);
		itemPositionTween.start();
		itemRotationTween.start();
		//回归原点完成后就进入心型轨道飞行
		itemRotationTween.onComplete(function() {
			FLY.Fly1(item, curve);
			//如果最后一只心心进入轨道就停止轨道飞行，进入下一段动画
			if (index == cubes.length - 1) {
				setTimeout(function(){
					FLY.flys1 = [];
					FLY.flys = [];
					for (var i in cubes) {
						FLY.Fly(cubes[i]);
					}
				},3000);
			}
		});
		timeDarly += 500;
	}
	//相机从近往远处拉
	setTimeout(function(){
		/* let tween = new TWEEN.Tween(camera.position);
		tween.onComplete(function(){
			if(pointGroup){
				scene.remove(pointGroup);
			};
			isEnablePhotoFlyToHert=true;
		});
		tween.to({x:0,y:0,z:1300}, 3000).start(); */
		var curve1 = new THREE.CatmullRomCurve3([
		  new THREE.Vector3(0, 0, 200),
		  new THREE.Vector3(200, 200, 0),
		  new THREE.Vector3(0, 400, -200),
		  new THREE.Vector3(-200, 200, 0),
		  new THREE.Vector3(0, 100, 200),
		  new THREE.Vector3(0, 0, 1300)
		],false);
		//由于相机飞行时渲染效率急剧下滑，所以这里考虑降低渲染质量(降低一半)，提升效率
		renderer.setPixelRatio(window.devicePixelRatio/2);
		FLY.FlyCamera2(false,curve1,0.002,function(){
			//相机飞行结束后
			//恢复渲染质量，渲染指数提升(渲染像素比率设置为标准屏幕像素)，同时渲染帧数会降低
			renderer.setPixelRatio(window.devicePixelRatio);
			//相机拉远动画完毕之后就重新创建UI
			createAllUi();
			//把粒子也移除
			if(pointGroup){
				scene.remove(pointGroup);
			};
			setTimeout(function(){
				currentGuide="photoFly";
				showHand(-0.3,0.1,0.03,0,-Math.PI/2);
			},2000);
		});
		isEnablePhotoFlyToHert=true;
	},2000);
	//巨型心心瞬间膨胀
	setTimeout(function(){
		createBigHert();
	},6000);
}

/* 射线对象拾取 */
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3();

/* UI元素拾取 */
function pickupObjects(e) {
	//将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
	var x = (e.layerX / window.innerWidth) * 2 - 1;
	var y = -(e.layerY / window.innerHeight) * 2 + 1;
	mouse.set(x, y, 0.5);
	//从相机发射一条射线，经过鼠标点击位置
	raycaster.setFromCamera(mouse, camera);
	//计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，按离相机远近排列
	let intersects = raycaster.intersectObject(scene, true);
	for (var i = 0; i < intersects.length; i++) {
		let item = intersects[i];
		if (item.object.name) {
			if (item.object.name.indexOf("btn0") != -1) {
				window.abc=document.getElementById("continer");
				document.getElementById("continer").style.display="block";
				return;
			} else if (item.object.name.indexOf("btn1") != -1) {
				if(initStartAnimationIsInit){
					return;
				}
				initStartAnimation();
				initStartAnimationIsInit=true;
				handHide();
				return;
			} else if (item.object.photoType&&isFinalLevel) {
				cameraFlyToPhoto(item.point);
				return;
			} else if (item.object.photoType) {
				photoFlyToHert(item.object.photoType);
				if(currentGuide=="photoFly"){
					handHide();
				}
				return;
			} else if (item.object.name.indexOf("mf") != -1) {
				if(mf.clickStatus){
					return;
				}
				mfClickCount++;
				if(currentGuide=="mf"){
					handHide();
					if(mfClickCount==1){
						setTimeout(function() {
							if(initStartAnimationIsInit==false){
								currentGuide="btn1";
								showHand(-0.8,-0.2,0.03,0.03,-Math.PI/4);
							}
						}, 5000);
					}
				}
				mfClick();
				return;
			}else if(isFinalLevel&&isCameraLeaveTrack){
				cameraBackFromPhoto();
			}else if(isFinalLevel&&item.object.name=="btnA"){
				// window.location.href="https://www.hunliji.com/p/wedding/Home/Pay/mv_card?card_id=MjYwODY4NDhmaXJlX2Nsb3Vk";
				// freeEyeTigger();
				return;
			}else if(isFinalLevel&&item.object.name=="btnB"){
				// freeEyeTigger();
				return;
			}
		}
	}
}

/* 粒子系统 */
var initPoints=function(){
	var group=new THREE.Group();
	var spriteMaterial = new THREE.SpriteMaterial( { color: 0xffffff,transparent:true,opacity:0.6} );
	for(var i=0;i<500;i++){
		var sprite = new THREE.Sprite( spriteMaterial );
		let x = THREE.Math.randFloatSpread( 1000 );
		let y = THREE.Math.randFloatSpread( 500 );
		let z = THREE.Math.randFloatSpread( 1000 );
		sprite.position.set(x,y,z);
		group.add(sprite);
	}
	window.pointGroup=group;
	scene.add(group);
}