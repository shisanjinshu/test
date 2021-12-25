/**
 * Create by Jiang Li 2018/12/24 16:28
 * 沿着轨道飞行
 * 思路1：创建一条代表该曲线的路径，然后动态的在该曲线上取点，将点传给相机，取到点的切线方向，改变相机朝向
 * 思路2：创建一条代表该曲线的路径，然后动态的在该曲线上取点，将点传给一个物体，取到点的切线方向，改变物体朝向，同时让相机跟随物体
 * 备注：目前实现了思路1，如果有需要，再实现思路2
 */

THREE.LJOrbitalRoaming = function (camera,points,scene) {
    var cameraPosition = new THREE.Vector3();
    cameraPosition.copy(camera.position);
    var cameraLookAt = new THREE.Vector3();
    cameraLookAt.copy(camera.lookAt);
    //传过来相机，主要是相机运动
    this.train  = camera;
    //飞行速度
    this.speed = 1.0/100000;

    //是否显示漫游路线
    this.isShowPath = false;
    //漫游路线的颜色
    this.pathColor = 0xff0000;

    //暂停
    this.suspended = false;//暂停飞行
    this.startFly = false;//开始飞行
    this.endFly = false;//结束飞行

    //是否循环飞行
    // this.isCycleFly = false;

    //根据数组点创建一条path路径
    var curves = new THREE.CatmullRomCurve3(points);

    var pathPoints = curves.getPoints(points.length * 100);//细分数为100，从spline曲线上获取系列顶点数据
    var geometry = new THREE.Geometry();//声明一个空几何体对象
    geometry.vertices = pathPoints; //顶点坐标添加到geometry对象
    var material=new THREE.LineBasicMaterial({
        color:this.pathColor //线条颜色
    });//材质对象
    var line=new THREE.Line(geometry,material);//线条模型对象
    line.visible = false;//线条路径默认不可见
    scene.add(line);

    //表示进度
    var progress = 0;

    var position = new THREE.Vector3();//位置

    var tangent = new THREE.Vector3();//切点方向点

    var lookAt = new THREE.Vector3();

    //更新状态
    this.update = function () {

        line.visible = this.isShowPath;
        //飞行开始
        if (this.startFly){
            //如果点了暂停
            if (!this.suspended) {
                //进度
                progress += this.speed/100000;
                progress = progress % 1;//进度用0到0.9999999999999之间的数表示

                //根据进度在路径上获取点
                position.copy(curves.getPointAt(progress));

                //获取切点的切线方向
                tangent.copy(curves.getTangentAt(progress));
                lookAt.copy(position).sub(tangent);

            }
            //把获取到的坐标传给动画对象
            this.train.position.copy(position);
            this.train.position.y += 0.1;
            //让相机看向当前点与切线方向点的方向
            this.train.lookAt(lookAt);
            this.train.rotateY(Math.PI);

        }

        //停止
        if (this.endFly) {
            this.startFly = false;
            this.suspended = false;
            this.train.position.copy(cameraPosition);
            this.train.lookAt(cameraLookAt);
            this.endFly = false;
        }

    }

};














