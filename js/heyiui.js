var loader = new THREE.GLTFLoader();
//ui相册
var uiPhoto1 = undefined;
var uiPhoto2 = undefined;
var uiPhoto3 = undefined;
//心型相册数组
var hertPhotoArray = [];
//页面的相册数组
var photoArray = [];
//是否允许相框飞向心型
var isEnablePhotoFlyToHert = false;
//巨型心心
var bigHert = undefined;
//图片资源数组是否加载完毕
var imgsLoaded = false;
//是否允许相册随机看向自己
var isHertPhotoArrayLookMe = false;
//魔方点击次数
var mfClickCount = 0;
//当前引导标识
var currentGuide = undefined;
//是否最后阶段
var isFinalLevel=false;
//相机是否脱离轨道状态
var isCameraLeaveTrack=true;
//是否自由视角
var isFreeEye=false;

//创建心型按钮
var createHertBtn = function(loader, scene) {
	loader.load('model/hertBtn.glb', function(gltf) {
		//获得对象
		let cube = gltf.scene;
		cube.scale.set(0.5, 0.5, 0.5);
		cube.children[0].name = "btn0"
		//将按钮加入场景，并运动到右上角位置
		scene.add(cube);
		FLY.hertBtn = cube;
		let tween = new TWEEN.Tween(cube.position);
		tween.to({
			x: pX * 0.5,
			y: pY * 0.8,
			z: camera.position.z - 200
		}, 2000);
		tween.start();
	}, undefined, function(error) {
		console.error(error);
	});
};

//创建水晶心型按钮
var createHertBtn1 = function(loader, scene) {
	loader.load('model/hertBtn.glb', function(gltf) {
		//获得对象
		let cube = gltf.scene;
		cube.children[0].name = "btn1";
		cube.scale.set(0.5, 0.5, 0.5);
		//将贴图透明
		//cube.children[0].material.color.set("#ffff00");
		cube.children[0].material.transparent = true;
		cube.children[0].material.opacity = 0.5;
		//将按钮加入场景，并运动到右上角位置
		scene.add(cube);
		FLY.hertBtn1 = cube;
		let tween = new TWEEN.Tween(cube.position);
		tween.to({
			x: pX * -0.5,
			y: 0,
			z: camera.position.z - 200
		}, 2000);
		tween.start();
	}, undefined, function(error) {
		console.error(error);
	});
};

//创建透明水晶魔方
var createMf = function(loader, scene) {
	loadImg("image/a.jpeg", function(img) {
		//1、创建立方体
		var geometry1 = new THREE.BoxGeometry(10, 10, 10);
		//设置材质,开启透明度,设置透明度0.5
		var material1 = new THREE.MeshLambertMaterial({
			color: 0x0000ff,
			transparent: true,
			opacity: 0.5,
		});
		var cube = new THREE.Mesh(geometry1, material1);
		//2、创建一个平面，大小跟立方体一样
		let geometry2 = new THREE.PlaneGeometry(10, 10);
		//材质是照片
		let material2 = new THREE.MeshBasicMaterial({
			map: img,
			side: THREE.DoubleSide
		});
		let material3 = new THREE.MeshBasicMaterial({
			map: img,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.8
		});
		let planeCube = new THREE.Mesh(geometry2, material2);
		let planeCube1 = new THREE.Mesh(geometry2, material3);
		planeCube1.position.x = -5.1;
		planeCube1.rotation.y = Math.PI / 2;
		let planeCube2 = new THREE.Mesh(geometry2, material3);
		planeCube2.position.x = 5.1;
		planeCube2.rotation.y = Math.PI / 2;
		//将立方体和平面绑定到一个组，组成魔方
		let group = new THREE.Object3D();
		group.add(cube);
		group.add(planeCube);
		group.add(planeCube1);
		group.add(planeCube2);
		cube.name = "mf_cube";
		planeCube.name = "mf_img1";
		planeCube1.name = "mf_img2";
		planeCube2.name = "mf_img3";
		//将魔方呈单角立起姿势
		group.rotation.x = Math.PI / 4;
		group.rotation.y = Math.PI / 4;
		group.rotation.z = Math.PI / 4;
		FLY.mf = group;
		//将魔方缩放比例放大
		group.scale.set(1.5, 1.5, 1.5);
		//将魔方加入场景，并运动到右下角位置
		scene.add(group);
		window.mf = group;
		let tween = new TWEEN.Tween(group.position);
		tween.to({
			x: pX * 0.5,
			y: -pY * 0.9,
			z: camera.position.z - 240
		}, 2000);
		tween.start();
	});
};

//创建相框
var createImg = function(photoType, loader, scene, obj, img, isPushHertArray) {
	//判断相片是横还是竖
	var imgWidth = img.image.width;
	var imgHeight = img.image.height;
	var type = 0;
	if (imgWidth > imgHeight) {
		type = 1;
	}
	//创建相框
	loader.load('model/xiangkuang.glb', function(gltf) {
		//创建相册组对象(用来组合相框和相片平面)
		let photoGroup = new THREE.Group();
		//获得相框模型
		let xiangkuang = gltf.scene;
		xiangkuang.children[0].material.color.set("#ffff00");
		//创建相片平面模型
		let imgPlane = undefined;
		if (type == 0) {
			imgPlane = new THREE.PlaneGeometry(10, 15);
		} else {
			imgPlane = new THREE.PlaneGeometry(15, 10);
			xiangkuang.rotateZ(Math.PI / 2);
		}
		let imgMaterial = new THREE.MeshBasicMaterial({
			map: img
		});
		let photo = new THREE.Mesh(imgPlane, imgMaterial);
		//将相框和照片添加进相册组
		xiangkuang.children[0].photoType = photoType;
		photo.photoType = photoType;
		photoGroup.add(xiangkuang);
		photoGroup.add(photo);
		xiangkuang.parentGroup=photoGroup;
		photo.parentGroup=photoGroup;
		//设置位置及缩放
		photoGroup.position.x = obj.position.x;
		photoGroup.position.y = obj.position.y;
		photoGroup.position.z = obj.position.z;
		photoGroup.rotation.x = obj.rotation.x;
		photoGroup.rotation.y = obj.rotation.y;
		photoGroup.rotation.z = obj.rotation.z;
		photoGroup.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
		scene.add(photoGroup);
		photoGroup.myObj = obj;
		if (photoType == "1") {
			uiPhoto1 = photoGroup;
		} else if (photoType == "2") {
			uiPhoto2 = photoGroup;
		} else if (photoType == "3") {
			uiPhoto3 = photoGroup;
		}
		if (isPushHertArray) {
			hertPhotoArray.push(photoGroup);
		} else {
			photoArray.push(photoGroup);
		}
		//切入动画
		photoEnter(photoGroup, obj);
	}, undefined, function(error) {
		console.error(error);
	});
}

//初始化贴图数组方法
var index2=0
var createPhotoGroup = function(isPushHertArray) {
	// var img1 = imgArray[Math.floor((Math.random() * imgArray.length))];
	// var img2 = imgArray[Math.floor((Math.random() * imgArray.length))];
	// var img3 = imgArray[Math.floor((Math.random() * imgArray.length))];
	var img1 = imgArray[index2];
	var img2 = imgArray[index2+1];
	var img3 = imgArray[index2+2];
	index2=index2+3
	if(index2>=40){
		index2=index2-40
	}
	createImg("1", loader, scene, {
		position: {
			x: -200,
			y: 200,
			z: 0
		},
		rotation: {
			x: 5,
			y: 5,
			z: 5
		},
		move: {
			x: -0.4,
			y: 0.5
		},
		scale: {
			x: 3,
			y: 3,
			z: 3
		}
	}, img1, isPushHertArray);
	createImg("2", loader, scene, {
		position: {
			x: -200,
			y: 0,
			z: -200
		},
		rotation: {
			x: 5,
			y: 0,
			z: 0
		},
		move: {
			x: 0.4,
			y: 0
		},
		scale: {
			x: 3,
			y: 3,
			z: 3
		}
	}, img2, isPushHertArray);
	createImg("3", loader, scene, {
		position: {
			x: 200,
			y: -200,
			z: 200
		},
		rotation: {
			x: 5,
			y: 5,
			z: -5
		},
		move: {
			x: -0.4,
			y: -0.5
		},
		scale: {
			x: 3,
			y: 3,
			z: 3
		}
	}, img3, isPushHertArray);
}

/* 创建相册切入动画 */
var photoEnter = function(photoGroup, obj) {
	//如果没有photoType不可以飞回
	if (!photoGroup.children[1].photoType) {
		return;
	}
	let tween1 = new TWEEN.Tween(photoGroup.position);
	tween1.to({
		x: pX * obj.move.x,
		y: pY * obj.move.y,
		z: camera.position.z - 200
	}, 2000).easing(TWEEN.Easing.Elastic.InOut);
	let tween2 = new TWEEN.Tween(photoGroup.rotation);
	tween2.to({
		x: 0,
		y: 0,
		z: 0
	}, 2000);
	let tween3 = new TWEEN.Tween(photoGroup.rotation);
	tween3.to({
		x: Math.PI / 20,
		y: Math.PI / 10,
		z: 0
	}, 2000);
	let tween4 = new TWEEN.Tween(photoGroup.rotation);
	tween4.to({
		x: -Math.PI / 20,
		y: -Math.PI / 10,
		z: 0
	}, 2000);
	tween2.chain(tween3);
	tween3.chain(tween4);
	tween4.chain(tween3);
	//检查当前是否有其他动画，如果有就停止，开始现在的动画
	delPhotoAnimation(photoGroup);
	photoGroup.tween1 = tween1;
	photoGroup.tween2 = tween2;
	photoGroup.tween3 = tween3;
	photoGroup.tween4 = tween4;
	tween1.start();
	tween2.start();
}

/* 创建相册切出动画 */
var photoLeave = function(photoGroup, obj, func) {
	let tween1 = new TWEEN.Tween(photoGroup.position);
	tween1.to({
		x: obj.position.x,
		y: obj.position.y,
		z: obj.position.z
	}, 2000);
	let tween2 = new TWEEN.Tween(photoGroup.rotation);
	tween2.to({
		x: obj.rotation.x,
		y: obj.rotation.y,
		z: obj.rotation.z
	}, 2000);
	//检查当前是否有其他动画，如果有就停止，开始现在的动画
	delPhotoAnimation(photoGroup);
	photoGroup.tween1 = tween1;
	photoGroup.tween2 = tween2;
	if (func) {
		tween2.onComplete(func);
	}
	tween1.start();
	tween2.start();
}

/* 创建巨型心心，用其顶点来作为相册的位置 */
var createBigHert = function() {
	loader.load('model/bigHert.glb', function(gltf) {
		//获得对象
		let cube = gltf.scene;
		//将贴图透明
		cube.children[0].material.transparent = true;
		cube.children[0].material.opacity = 0.1;
		//把缩放设置为0
		cube.scale.set(0, 0, 0);
		//加入场景
		scene.add(cube);
		bigHert = cube;
		//心心瞬间膨胀
		let tween = new TWEEN.Tween(cube.scale);
		tween.to({
			x: 1,
			y: 1,
			z: 1
		}, 1000).start();
		let tween1 = new TWEEN.Tween(cube.scale).to({
			x: 0.8,
			y: 1,
			z: 1.1
		}, 2000);
		let tween2 = new TWEEN.Tween(cube.scale).to({
			x: 1.1,
			y: 1,
			z: 0.9
		}, 2000);
		tween1.chain(tween2);
		tween2.chain(tween1);
		tween1.start();
	}, undefined, function(error) {
		console.error(error);
	});
}

var index = 0;
/* 相册飞向心型 */
var photoFlyToHert = function(photoType) {
	if (!isEnablePhotoFlyToHert) {
		return;
	}
	if (index >= 40) {
		return;
	}
	var cube = undefined;
	if (photoType == "1") {
		cube = uiPhoto1;
	} else if (photoType == "2") {
		cube = uiPhoto2;
	} else if (photoType == "3") {
		cube = uiPhoto3;
	}
	if (!cube) {
		return;
	}
	//将相册移动到指巨型心心顶点
	let indexTmp;
	if(index>=30){
		 indexTmp=index-30
	}else{
		 indexTmp=index
	}
	let x = bigHert.children[0].geometry.attributes.position.getX(indexTmp);
	let y = bigHert.children[0].geometry.attributes.position.getY(indexTmp);
	let z = bigHert.children[0].geometry.attributes.position.getZ(indexTmp);
	let xn = (bigHert.children[0].geometry.attributes.position.getX(indexTmp) + x);
	let yn = (bigHert.children[0].geometry.attributes.position.getY(indexTmp) + y);
	let zn = (bigHert.children[0].geometry.attributes.position.getZ(indexTmp) + z);

	console.log(x,y,z,xn,yn,zn)
	let tween1 = new TWEEN.Tween(cube.position).to({
		x: x,
		y: y,
		z: z
	}, 3000);
	let tween2 = new TWEEN.Tween(cube.rotation).to({
		x: Math.PI,
		y: Math.PI,
		z: Math.PI
	}, 3000);
	tween1.onComplete(function() {
		//增加photoType1属性，用来做下一次点击的监听基础
		cube.photoType1 = cube.photoType;
		//移除photoType属性，不然飞走了还可以点击
		cube.photoType = undefined;
	});
	//检查当前是否有其他动画，如果有就停止，开始现在的动画
	delPhotoAnimation(cube);
	tween1.start();
	tween2.start();
	//让物体朝向目标点的法向量
	cube.lookAt(xn, yn, zn);
	index++;
	//在创建完成之前置空
	if (photoType == "1") {
		uiPhoto1 = undefined;
	} else if (photoType == "2") {
		uiPhoto2 = undefined;
	} else if (photoType == "3") {
		uiPhoto3 = undefined;
	}
	//创建补充相册
	if(index==40){
		//相片完了之后，自动触发相机飞行
		isFinalLevel=true;
		cameraFlyForBigHert();
	}
	if (index >= 40) {
		return;
	}
	let obj = undefined;
	// let img = imgArray[Math.floor((Math.random() * imgArray.length))];
	let img = imgArray[index];
	if (photoType == "1") {
		obj = {
			position: {
				x: -500,
				y: 500,
				z: 0
			},
			rotation: {
				x: 5,
				y: 5,
				z: 5
			},
			move: {
				x: -0.4,
				y: 0.5
			},
			scale: {
				x: 3,
				y: 3,
				z: 3
			}
		};
	} else if (photoType == "2") {
		obj = {
			position: {
				x: -500,
				y: 0,
				z: -500
			},
			rotation: {
				x: 5,
				y: 0,
				z: 0
			},
			move: {
				x: 0.4,
				y: 0
			},
			scale: {
				x: 3,
				y: 3,
				z: 3
			}
		};
	} else if (photoType == "3") {
		obj = {
			position: {
				x: 500,
				y: -500,
				z: 500
			},
			rotation: {
				x: 5,
				y: 5,
				z: -5
			},
			move: {
				x: -0.4,
				y: -0.5
			},
			scale: {
				x: 3,
				y: 3,
				z: 3
			}
		};
	} else {
		return;
	}
	createImg(photoType, loader, scene, obj, img, true);
}

/* 删除相册现有动画 */
var delPhotoAnimation = function(cube) {
	//检查当前是否有其他动画，如果有就停止，开始现在的动画
	if (cube.tween1) {
		cube.tween1.stop();
		TWEEN.remove(cube.tween1);
	}
	if (cube.tween2) {
		cube.tween2.stop();
		TWEEN.remove(cube.tween2);
	}
	if (cube.tween3) {
		cube.tween3.stop();
		TWEEN.remove(cube.tween3);
	}
	if (cube.tween4) {
		cube.tween4.stop();
		TWEEN.remove(cube.tween4);
	}
}

/* 删除所有UI元素（包括动画） */
var delAllUi = function() {
	//删除相册元素及动画
	for (var p of photoArray) {
		delPhotoAnimation(p);
		scene.remove(p);
	}
	//删除心形按钮及动画
	scene.remove(FLY.hertBtn);
	FLY.hertBtn = undefined;
	scene.remove(FLY.hertBtn1);
	FLY.hertBtn1 = undefined;
	//删除魔方及动画
	FLY.mf = undefined;
	scene.remove(mf);
}

/* 重新创建UI元素 */
var createAllUi = function() {
	createHertBtn(loader, scene);
	createPhotoGroup(true);
}

/* 初始化手型提示 */
var intHandIcon = function() {
	loadImg("image/hand.png", function(img) {
		var spriteMaterial = new THREE.SpriteMaterial({
			map: img,
			transparent: true,
			opacity: 0.6
		});
		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.visible = false;
		scene.add(sprite);
		window.hand = sprite;
	});
}

/* 初始化图标按钮 */
// var initIconBtn = function() {
// 	loadImg("image/btnA.png", function(img) {
// 		var spriteMaterial = new THREE.SpriteMaterial({
// 			map: img,
// 			transparent: true,
// 			opacity: 1
// 		});
// 		var sprite = new THREE.Sprite(spriteMaterial);
// 		sprite.name="btnA";
// 		scene.add(sprite);
// 		window.btnA = sprite;
// 	});
// 	loadImg("image/btnB.png", function(img) {
// 		var spriteMaterial = new THREE.SpriteMaterial({
// 			map: img,
// 			transparent: true,
// 			opacity: 1
// 		});
// 		var sprite = new THREE.Sprite(spriteMaterial);
// 		sprite.name="btnB";
// 		scene.add(sprite);
// 		window.btnB = sprite;
// 		window.btnB_img_A=img;
// 	});
// 	loadImg("image/btnB1.png", function(img) {
// 		window.btnB_img_B=img;
// 	});
// }

/* 手型显示 */
var showHand = function(px, py, tx, ty, rotation) {
	if (hand) {
		const x = pX1 * px,
			x1 = pX1 * tx;
		const y = pY1 * py,
			y1 = pY1 * ty;
		hand.position.set(x, y, camera.position.z - 10);
		hand.material.rotation = rotation;
		hand.visible = true;
		let tween1 = new TWEEN.Tween(hand.position).to({
			x: x + x1,
			y: y + y1,
			z: hand.position.z
		});
		let tween2 = new TWEEN.Tween(hand.position).to({
			x: x,
			y: y,
			z: hand.position.z
		});
		tween1.chain(tween2);
		tween2.chain(tween1);
		hand.tween = [];
		hand.tween.push(tween1);
		hand.tween.push(tween2);
		tween1.start();
	}
}

/* 手型隐藏 */
var handHide = function() {
	if (hand) {
		if (hand.tween && hand.tween.length > 0) {
			for (let item of hand.tween) {
				TWEEN.remove(item);
			}
		}
		hand.visible = false;
	}
}

/* 相机朝相册飞去 */
var cameraFlyToPhoto = function(point) {
	if (!point) {
		return;
	}
	//先清除相机的动画
	if(camera.tween&&camera.tween.length>0){
		for(let item of camera.tween){
			item.stop();
			TWEEN.remove(item);
		}
	}
	camera.tween=[];
	//暂停圆周飞行
	FLY.enableCameraTrackFly=false;
	let tween1 = new TWEEN.Tween(camera.position).to({
		x: point.x,
		y: point.y,
		z: point.z-100
	}, 2000);
	//渲染级别提升
	renderer.setPixelRatio(window.devicePixelRatio);
	isCameraLeaveTrack=true;
	FLY.cameraLookAtPoint=point;
	camera.tween.push(tween1);
	tween1.start();
}

/* 相机返回轨道 */
var cameraBackFromPhoto=function(){
	//先清除相机的动画
	if(camera.tween&&camera.tween.length>0){
		for(let item of camera.tween){
			item.stop();
			TWEEN.remove(item);
		}
	}
	//回到原来的点上
	let tween1 = new TWEEN.Tween(camera.position).to({
		x: FLY.cameraTrackCurrentPoint.x,
		y: FLY.cameraTrackCurrentPoint.y,
		z: FLY.cameraTrackCurrentPoint.z
	}, 2000);
	//渲染级别恢复
	renderer.setPixelRatio(window.devicePixelRatio/2);
	tween1.onComplete(function(){
		//恢复圆周飞行
		FLY.enableCameraTrackFly=true;
		isCameraLeaveTrack=false;
		FLY.cameraLookAtPoint=undefined;
	});
	tween1.start();
}

/* 鼠标点击事件 */
document.getElementById("canvas-frame").onclick = function(ev) {
	pickupObjects(ev);
};

/* 魔方被点击事件 */
var mfClick = function() {
	//魔方被点击，魔方快速转动
	let tween = new TWEEN.Tween(mf.rotation);
	tween.to({
		x: mf.rotation.x + 50,
		y: mf.rotation.y + 50,
		z: mf.rotation.y + 50
	}, 1500);
	tween.start();
	//相册离开后再进入
	for (var index in photoArray) {
		let item = photoArray[index];
		photoLeave(item, item.myObj, function() {
			//移除然后重新创建
			if(index==photoArray.length-1){
				for (var p of photoArray) {
					delPhotoAnimation(p);
					scene.remove(p);
				}
				createPhotoGroup(false);
			}
		});
	}
}

/* 相机围绕巨型心心飞行 */
var cameraFlyForBigHert = function() {
	if (isEnablePhotoFlyToHert) {
		if (hertPhotoArray.length >= 29) {
			curve = new THREE.CatmullRomCurve3([
				new THREE.Vector3(0, 0, 1000),
				new THREE.Vector3(1000, 0, 0),
				new THREE.Vector3(0, 0, -1000),
				new THREE.Vector3(-1000, 0, 0)
			], true /*是否闭合*/ );
			FLY.FlyCamera2(true, curve, 0.0005);
			isHertPhotoArrayLookMe = true;
			isCameraLeaveTrack=false;
			//降低一下渲染质量，因为这里渲染效率不高，渲染像素比率设置为标准屏幕像素
			renderer.setPixelRatio(window.devicePixelRatio / 2);
			//在10秒后显示水晶魔方，可以点击操控自由视角;显示水晶心心，可以点击离开本页面跳转到视频请柬页面
			setTimeout(function() {
				initIconBtn();
				FLY.mfAndHertBtnFrontCamera=true;
			}, 10000);
		}
		return;
	}
}

/* 视角切换 */
var freeEyeTigger=function(){
	isFreeEye=!isFreeEye;
	if(isFreeEye){
		btnB.material.map=btnB_img_B;
	}else{
		btnB.material.map=btnB_img_A;
		camera.up.set(0,1,0);
	}
}