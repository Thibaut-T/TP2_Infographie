const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight-250), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight-250);
document.body.appendChild( renderer.domElement ); //création de la scène 

const material = new THREE.PointsMaterial({ //définition taille et couleurs des points
    size: 0.06,
    color: 0x7CFC00
});

const points = []; // tableau de points
const distance = 10; //point de la caméra

renderer.domElement.addEventListener("click", function(e) //Add event to our canvas 
{
    getMousePosition(renderer.domElement, e);      //If their is ²a click, call the function 
});

let button_reset=document.getElementById("reset");
button_reset.addEventListener("click",reset);


let button = document.getElementById("valider");
button.addEventListener("click", wichOne);

function wichOne(){
    (document.getElementById("coordonnees").value == "") ? calculate() : takeCoordonnees();
}

let cercle=document.getElementById("cercle");
let coeur=document.getElementById("coeur");

cercle.addEventListener("click",drawCircle);
coeur.addEventListener("click",drawHeart);


function reset(){
    document.location.reload(true);
}

function drawCircle(){
    let coordX=document.getElementById("X");
    coordX.setAttribute('value',"cos(t)");
    let coordY=document.getElementById("Y");
    coordY.setAttribute('value',"sin(t)"); 
}

function drawHeart(){
    let coord2X=document.getElementById("X");
    coord2X.setAttribute('value',"pow(sin(t), 3)");
    let coord2Y=document.getElementById("Y");
    coord2Y.setAttribute('value',"cos(t)-pow(cos(t),4)"); 
}

/**
 * Récupère les équations, calcule la courbe et affiche le rendu
 */
function calculate(){

    let x,y,X = document.getElementById("X"),Y = document.getElementById("Y");
    x = transformString(X.value);
    y = transformString(Y.value);

    for(let t = 0; t < 2*Math.PI; t+=0.0001){
        points.push( new THREE.Vector3( evaluate(t,x), evaluate(t,y), 0 ) );
    }
    
    afficherCourbe(points);
}

/**
 * Affiche les points de la courbe paramétrique
 */
function afficherCourbe(tab){
    const geometry = new THREE.BufferGeometry().setFromPoints( tab );
    
    const figure = new THREE.Points( geometry, material );
    scene.add( figure ); // on ajoute à la scène tous les points
    camera.position.z = distance;
    renderer.render( scene, camera );
}

/**
 * Modifie une équation pour qu'elle soit lisible lors de l'évaluation. Elle ajoute la syntax de Math.js
 * @param {string} str 
 * @returns {string}
 */
function transformString(str){
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
function evaluate(t, str){
    let tab = str.split("*t");
    str = tab.join("*"+t);
    tab = str.split("+t");
    str = tab.join("+"+t);
    tab = str.split("-t");
    str = tab.join("-"+t);
    tab = str.split("/t");
    str = tab.join("/"+t);
    tab = str.split("(t");
    str = tab.join("("+t);
    tab = str.split(",t");
    str = tab.join(","+t);
    if(str[0] == 't'){
        tab = str.split("t");
        tab.shift();
        str = t + tab.join('t');
    }
    return eval(str);
}

