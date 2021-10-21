let btnMoveLeft = document.getElementById("left");
btnMoveLeft.addEventListener("click", () => {
    cam.x++;
    camera.position.x = cam.x;
    renderer.render(scene, camera);
})
let btnMoveRight = document.getElementById("right");
btnMoveRight.addEventListener("click", () => {
    cam.x--;
    camera.position.x = cam.x;
    renderer.render(scene, camera);
})
let btnMoveDown = document.getElementById("down");
btnMoveDown.addEventListener("click", () => {
    cam.y++;
    camera.position.y = cam.y;
    renderer.render(scene, camera);
})
let btnMoveUp = document.getElementById("up");
btnMoveUp.addEventListener("click", () => {
    cam.y--;
    camera.position.y = cam.y;
    renderer.render(scene, camera);
})