// If you want to enlarge the visual without changing the coordinates
let btnZoomIn = document.getElementById("zoomIn");
btnZoomIn.addEventListener("click", () => {
    cam.z--;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
})

// If you want to reduce the visual without changing the coordinates
let btnZoomOut = document.getElementById("zoomOut");
btnZoomOut.addEventListener("click", () => {
    cam.z++;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
})