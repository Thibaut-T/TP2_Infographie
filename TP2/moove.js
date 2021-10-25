/**
 * If you want to move the curve to the left
 */
let btnMoveLeft = document.getElementById("left");
btnMoveLeft.addEventListener("click", () => {
    cam.x++;
    camera.position.x = cam.x;
    renderer.render(scene, camera);
})

/**
 * If you want to move the curve to the right
 */
let btnMoveRight = document.getElementById("right");
btnMoveRight.addEventListener("click", () => {
    cam.x--;
    camera.position.x = cam.x;
    renderer.render(scene, camera);
})

/**
 * If you want to move the curve down
 */
let btnMoveDown = document.getElementById("down");
btnMoveDown.addEventListener("click", () => {
    cam.y++;
    camera.position.y = cam.y;
    renderer.render(scene, camera);
})

/**
 * If you want to move the curve up
 */
let btnMoveUp = document.getElementById("up");
btnMoveUp.addEventListener("click", () => {
    cam.y--;
    camera.position.y = cam.y;
    renderer.render(scene, camera);
})