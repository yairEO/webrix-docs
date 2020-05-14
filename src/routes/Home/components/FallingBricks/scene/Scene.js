import {Camera, Ground, Light, Pipeline, Shadows, Brick} from './index';

const Scene = engine => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    // Physics
    scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

    return scene;
};

// createScene(...):
export default engine => {
    const scene = new Scene(engine);
    const camera = new Camera(scene);
    const light = new Light(scene);
    const shadows = new Shadows(scene, light);
    const pipeline = new Pipeline(scene);
    const ground = new Ground(scene);

    // Add bricks every few seconds
    let prev = Date.now();
    const bricks = [];
    BABYLON.SceneLoader.ImportMesh('', 'resources/models/', 'brick.stl', scene, ([brickMesh]) => {
        brickMesh.setEnabled(false); // Hide the original mesh
        scene.onBeforeRenderObservable.add(() => {
            if (Date.now() - prev > 500) {
                prev = Date.now();
                const brick = new Brick(scene, brickMesh);
                shadows.addShadowCaster(brick);
                bricks.push(brick);
                if (bricks.length > 50) {
                    bricks.shift().dispose();
                }
            }
        });
    });

    return scene;
};