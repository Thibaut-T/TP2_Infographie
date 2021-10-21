let btnZoomIn = document.getElementById("zoomIn");
btnZoomIn.addEventListener("click", () => {
    cam.z--;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
})
let btnZoomOut = document.getElementById("zoomOut");
btnZoomOut.addEventListener("click", () => {
    cam.z++;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
})