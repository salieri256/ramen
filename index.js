import * as THREE from "https://threejs.org/build/three.module.js";
import Stats from "https://threejs.org/examples/jsm/libs/stats.module.js";
import {OrbitControls} from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

//Three.js
const width = innerWidth;
const height = innerHeight;
const dpr = window.devicePixelRatio || 1;

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true//背景透明
});
renderer.setSize(width, height);
renderer.setPixelRatio(dpr);//レンダラーの解像度をデバイスに合わせる

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.set(0, 50, 50);
camera.lookAt(new THREE.Vector3(0, 0, -50));

//マウスで視点操作
const orbit = new OrbitControls(camera, canvas);

for(let i = 0; i < 4; i++) {
    const light = new THREE.DirectionalLight(0xffffff);
    const x = 1000 * Math.cos(Math.PI/2 * i);
    const z = 1000 * Math.sin(Math.PI/2 * i);
    light.position.set(x, 1000, z);
    scene.add(light);
}

//平面グリッド線
const grid = new THREE.GridHelper(100, 10, 0xff0000);//全体のサイズ、分割数、color1、color2
scene.add(grid);

//xyz軸
const axes = new THREE.AxesHelper(1000);
scene.add(axes);

//fps確認
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//セットアップここまで

const chopsticks = new THREE.Group();
const ramen = () => {
    //器
    {
        const points = [];
        for (let i = 0; i < 8; i++) {
            points.push(new THREE.Vector2(Math.sin( i * 0.25 ) * 10 + 5, i * 2 ));
        }
        
        const geometry = new THREE.LatheGeometry(points, 30);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const lathe = new THREE.Mesh(geometry, material);
        scene.add(lathe);
    }

    //器の底
    {
        const geometry = new THREE.CircleGeometry(5.05, 30);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const bottom = new THREE.Mesh(geometry, material);
        bottom.rotation.x = Math.PI / 2;

        scene.add(bottom);
    }

    //箸
    scene.add(chopsticks);

    {
        const geometry = new THREE.BoxGeometry(25, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({color: 0xff0000});
        const chopstick1 = new THREE.Mesh(geometry, material);
        const chopstick2 = new THREE.Mesh(geometry, material);
        chopstick2.rotation.z = Math.PI / 24;
        chopstick1.position.set(10, 0, 0);
        chopstick2.position.set(10, 3, 0);

        chopsticks.add(chopstick1);
        chopsticks.add(chopstick2);
    }

    //箸を動かす棒
    {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 17, 32);
        const material = new THREE.MeshPhongMaterial({color: 0xc9caca, metal: true});
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.y = -6.6;

        chopsticks.add(cylinder);
    }

    //スープ
    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load("img/soup.jpg");
        const geometry = new THREE.CircleGeometry(14.3, 30);
        const material = new THREE.MeshStandardMaterial({map: texture});//{color: 0xd9b470}
        const soup = new THREE.Mesh(geometry, material);
        soup.rotation.x = -Math.PI / 2;
        soup.position.y = 10;

        scene.add(soup);
    }

    //麺
    {
        const material = new THREE.MeshPhongMaterial({color: 0xdebf68});
        const f = i => {
            const x1 = 6 * Math.random() - 2;
            const y = 0.5 * Math.random() + 10.5;
            const z1 = 0.2 * Math.random() + 0.4;
            const z2 = -0.2 * Math.random() - 0.4;
            const path = new THREE.SplineCurve3([
                new THREE.Vector3(x1, -5, z1),
                new THREE.Vector3(x1, y, z1),
                new THREE.Vector3(x1, y, z2),
                new THREE.Vector3(x1, -5, z2)
            ]);
            
            const geometry = new THREE.TubeGeometry(path, 30, 0.2, 30, false);
            const noodle = new THREE.Mesh(geometry, material);
            noodle.position.y = -10;
            chopsticks.add(noodle);
        }

        for(let i = 0; i < 20; i++) {
            f();
        }
    }

}

let time = 0;
const tick = () => {
    chopsticks.position.y = Math.sin(0.1 * time) * 5 + 20;
    renderer.render(scene, camera);
    time++;
    stats.update();

    requestAnimationFrame(tick);
}

ramen();
tick();