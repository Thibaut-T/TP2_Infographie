const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 250), 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 250);
document.body.appendChild(renderer.domElement); //Create scene

const material = new THREE.PointsMaterial({ //Definie size/color of point
    size: 0.06,
    color: 0x7CFC00
});

const points = []; // tab of points
let cam = new THREE.Vector3(0, 0, 10);
let change=document.getElementById("coordonnees");

renderer.domElement.addEventListener("click", function (e) //Add event to our canvas 
{
    getMousePosition(renderer.domElement, e);      //If their is a click, call the function 
});

let button_app1=document.getElementById("app1");
button_app1.addEventListener("click",app1 = () =>{
    change.value="0;0 1;1 1;0";
});

let button_app2=document.getElementById("app2");
button_app2.addEventListener("click",app2 = () =>{
    change.value="0;0 0;1 1;1";
});

let button_app3=document.getElementById("app3");
button_app3.addEventListener("click",app3 = () =>{
    change.value="0;0 1;1 1;0";
});

let button_reset = document.getElementById("reset");
button_reset.addEventListener("click", resetButton);


let button = document.getElementById("valider");
button.addEventListener("click", wichOne);

function wichOne() {
    (document.getElementById("coordonnees").value == "") ? calculate() : takeCoordonnees();
}

/**
 * Reset canvas, points and droite array
 */
function resetButton() {
    reset();
    translationX.value = 0;
    translationY.value = 0;
    homothetie.value = 100;
    rotation.value = 0;
    document.getElementById("transXOutputId").value= "0";
    document.getElementById("transYOutputId").value= "0";
    document.getElementById("homotOutputId").value = "1.00";
    document.getElementById("rotOutputId").value = "O°";

    cam = new THREE.Vector3(0, 0, 10);
    camera.position.x = cam.x;
    camera.position.y = cam.y;
    camera.position.z = cam.z;
    points.splice(0, points.length);
    droite.splice(0, droite.length);
    document.getElementById("change").style.display = "none";
    document.getElementById("weight").style.display = "none";
    poids.value = 0;
    poidsOutput.value = "0.00";
    if (document.getElementById("ListOfPoints").children.length == 2) {
        document.getElementById("ListOfPoints").removeChild(document.getElementById("ListOfPoints").lastElementChild);
    }
}

/**
 * Reset canvas
 */
function reset() {
    scene.children.splice(0, scene.children.length);
    renderer.render(scene, camera);
}

/**
 *
 * Get equations and calculate the curve and print it
 */
function calculate() {

    let x, y, X = document.getElementById("X"), Y = document.getElementById("Y");
    x = transformString(X.value);
    y = transformString(Y.value);

    for (let t = 0; t < 2 * Math.PI; t += 0.0001) {
        points.push(new THREE.Vector3(evaluate(t, x) + eval(translationX.value), evaluate(t, y) + eval(translationY.value), 0));
    }

    afficherPoints(points);
}

/**
 * Draw points of parametric curve
 */
function afficherPoints(tab) {

    let newTab = [], transXVal = eval(translationX.value), transYVal = eval(translationY.value), homotVal = eval(homothetie.value), rotVal = eval(rotation.value), alpha = Math.PI*rotVal/180;
    tab.forEach(elem => {
        let x = Math.trunc((elem.x + transXVal) * homotVal) / 100;
        let y = Math.trunc((elem.y + transYVal)* homotVal) / 100;
        newTab.push(new THREE.Vector3(Math.trunc((x*Math.cos(alpha) - y * Math.sin(alpha))*100)/100 , Math.trunc((x*Math.sin(alpha) + y * Math.cos(alpha))*100)/100, elem.z))
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(newTab);

    const figure = new THREE.Points(geometry, material);
    scene.add(figure); 
    camera.position.x = cam.x;
    camera.position.y = cam.y;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
}

/**
 * Modifie une équation pour qu'elle soit lisible lors de l'évaluation. Elle ajoute la syntax de Math.js
 * @param {string} str 
 * @returns {string}
 */
function transformString(str) {
    let tab = str.split("cos");
    str = tab.join("Math.cos");
    tab = str.split("sin");
    str = tab.join("Math.sin");
    tab = str.split("pi");
    str = tab.join("Math.PI");
    tab = str.split("sqrt");
    str = tab.join("Math.sqrt");
    tab = str.split("pow");
    str = tab.join("Math.pow");
    tab = str.split("exp");
    str = tab.join("Math.exp");
    return str;
}

/**
 * Evalue une équation pour un t donné
 * @param {float} t 
 * @param {string} str 
 * @returns {float}
 */
function evaluate(t, str) {
    let tab = str.split("*t");
    str = tab.join("*" + t);
    tab = str.split("+t");
    str = tab.join("+" + t);
    tab = str.split("-t");
    str = tab.join("-" + t);
    tab = str.split("/t");
    str = tab.join("/" + t);
    tab = str.split("(t");
    str = tab.join("(" + t);
    tab = str.split(",t");
    str = tab.join("," + t);
    if (str[0] == 't') {
        tab = str.split("t");
        tab.shift();
        str = t + tab.join('t');
    }
    return eval(str);
}

