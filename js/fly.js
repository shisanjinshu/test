var FLY = function() {};
FLY.distance=100;
FLY.speed=0.1;
FLY.flys = [];
FLY.flys1 = [];
FLY.hertBtn=null;
FLY.hertBtn1=null;
FLY.mf=null;
FLY.enableCameraTrackFly=true;
FLY.cameraTrackFly=undefined;
FLY.cameraLookAtPoint=undefined;
FLY.cameraTrackCurrentPoint=undefined;
FLY.mfAndHertBtnFrontCamera=false;

/* 动画0：物体自由飞行 */
FLY.Fly = function(cube) {
	let c = cube;
	FLY.flys.push(function() {
		let r1 = Math.random();
		let r2 = Math.random() * 100;
		let r3 = Math.random() * 10;
		c.translateZ(r1 + FLY.speed);
		const xPow = Math.pow(flyCenter.x - c.position.x, 2);
		const yPow = Math.pow(flyCenter.y - c.position.y, 2);
		const zPow = Math.pow(flyCenter.z - c.position.z, 2);
		let d = Math.sqrt(xPow + yPow + zPow);
		if (d > FLY.distance + r2) {
			//console.log("当前随机速度:",r1);
			c.rotateY(Math.PI / (360 - r3));
		}
	});
}

/* 动画1：物体绕心型轨道飞行 */
FLY.Fly1 = function(cube,curve,callback) {
	let c = cube;
	let progress = 0.0001;
	let func=function() {
		if(progress>=1.0){
			if(callback){
				callback();
			}
			HeyiUtil.removeArrayByObject(FLY.flys1,func);
			return;
		}
		if (curve) {
			let point = curve.getPoint(progress);
			if (point) {
				c.position.set(point.x, point.y, point.z);
				const nextPoint=curve.getPoint(progress+0.0001);
				c.lookAt(nextPoint.x,nextPoint.y,nextPoint.z);
			}
		}
		progress += 0.0015;
	};
	FLY.flys1.push(func);
}

/* 动画2：魔方自转运动 */
FLY.FlyHertBtn= function(cube) {
	let c = cube;
	cube.rotation.y+=0.01;
}

/* 动画3：魔方自转运动 */
FLY.FlyMf= function(cube) {
	let c = cube;
	cube.rotation.x+=0.01;
	cube.rotation.z+=0.01;
}

/* 动画4：物体带动相机运动 */
FLY.FlyCamera1= function() {
	camera.lookAt(0,0,0);
	camera.rotateY(0.1);
	camera.translateX(5);
}

/* 动画5：相机轨道飞行 */
FLY.FlyCamera2 = function(loop,curve,speed,callback) {
	let c = camera;
	var progress = 0.0001;
	FLY.cameraTrackFly=function(){
		if(progress>=1.0&&!loop){
			if(callback){
				callback();
			}
			//这里代表相机飞行完毕，移除FLY.cameraTrackFly引用
			FLY.cameraTrackFly=null;
			return;
		}
		if (curve) {
			let point = curve.getPoint(progress);
			if (point) {
				c.position.set(point.x, point.y, point.z);
				FLY.cameraTrackCurrentPoint=point;
				c.lookAt(0,0,0);
			}
		}
		//progress += 0.0015;
		progress += speed;
	}
}

/* 动画6：让相册都看向自己 */
FLY.Fly2= function(cube) {
	for(let item of hertPhotoArray){
		item.lookAt(camera.position.x,camera.position.y,camera.position.z);
	}
}

/* 动画7：摄像机注视某个点 */
FLY.Fly3= function(point) {
	camera.lookAt(point.x,point.y,point.z);
}

/* 动画8：让魔方和心心相对静止在摄像机前 */
FLY.Fly4= function() {
	if(btnA){
		btnA.position.copy( camera.position );
		btnA.rotation.copy( camera.rotation );
		btnA.updateMatrix();
		btnA.translateX(-pX1 * 0.6);
		btnA.translateY(-pY1 * 0.7);
		btnA.translateZ(-10);
	}
	if(btnB){
		btnB.position.copy( camera.position );
		btnB.rotation.copy( camera.rotation );
		btnB.updateMatrix();
		btnB.translateX(pX1 * 0.6);
		btnB.translateY(-pY1 * 0.7);
		btnB.translateZ(-10);
	}
}

FLY.update = function() {
	if(isFlyCenter){
		for (var item of FLY.flys) {
			item();
		}
	}
	if(isFlyHert){
		for (var item of FLY.flys1) {
			item();
		}
	}
	if(FLY.hertBtn){
		FLY.FlyHertBtn(FLY.hertBtn);
	}
	if(FLY.hertBtn1){
		FLY.FlyHertBtn(FLY.hertBtn1);
	}
	if(FLY.mf){
		FLY.FlyMf(FLY.mf);
	}
	if(FLY.car){
		FLY.FlyCamera1();
	}
	if(FLY.enableCameraTrackFly&&FLY.cameraTrackFly){
		FLY.cameraTrackFly();
	}
	if(isHertPhotoArrayLookMe){
		FLY.Fly2();
	}
	if(FLY.cameraLookAtPoint){
		FLY.Fly3(FLY.cameraLookAtPoint);
	}
	if(FLY.mfAndHertBtnFrontCamera){
		FLY.Fly4();
	}
}
