const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 250), 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 250);
document.body.appendChild(renderer.domElement); //création de la scène 

const material = new THREE.PointsMaterial({ //définition taille et couleurs des points
    size: 0.06,
    color: 0x7CFC00
});

const points = []; // tableau de points
let cam = new THREE.Vector3(0, 0, 10);//point de la caméra

renderer.domElement.addEventListener("click", function (e) //Add event to our canvas 
{
    getMousePosition(renderer.domElement, e);      //If their is a click, call the function 
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
    translation.value = 0;
    homothetie.value = 100;
    document.getElementById("transVal").innerHTML = "0";
    document.getElementById("homotVal").innerHTML = "1.00";

    cam = new THREE.Vector3(0, 0, 10);
    camera.position.x = cam.x;
    camera.position.y = cam.y;
    camera.position.z = cam.z;
    points.splice(0, points.length);
    droite.splice(0, droite.length);
    document.getElementById("change").style.display = "none";
    document.getElementById("weight").style.display = "none";
    document.getElementById("poids").innerHTML = "Poids : 0.00";
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
 * Récupère les équations, calcule la courbe et affiche le rendu
 */
function calculate() {

    let x, y, X = document.getElementById("X"), Y = document.getElementById("Y");
    x = transformString(X.value);
    y = transformString(Y.value);

    for (let t = 0; t < 2 * Math.PI; t += 0.0001) {
        points.push(new THREE.Vector3(evaluate(t, x) + eval(translation.value), evaluate(t, y), 0));
    }

    afficherPoints(points);
}

/**
 * Affiche les points de la courbe paramétrique
 */
function afficherPoints(tab) {

    let newTab = [], transVal = eval(translation.value), homotVal = eval(homothetie.value);
    tab.forEach(elem => newTab.push(new THREE.Vector3(Math.trunc((elem.x + transVal) * homotVal) / 100, Math.trunc(elem.y * homotVal) / 100, elem.z)));
    const geometry = new THREE.BufferGeometry().setFromPoints(newTab);

    const figure = new THREE.Points(geometry, material);
    scene.add(figure); // on ajoute à la scène tous les points
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

