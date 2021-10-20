const line = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0x0000FF
})

const stepByStep = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0xCD0300
})

const droite = []; // Tableau de points pour la droite
const casteljauPoints = []; // Tableau de points pour la courbe avec l'olgo de Casteljau

let coordonnees=document.getElementById("coordonnees");

let button_coordonnees=document.getElementById("1");
button_coordonnees.addEventListener("click",afficherDroite);

let btnMore = document.getElementById("+");
btnMore.addEventListener("click", more);
let btnLess = document.getElementById("-");
btnLess.addEventListener("click", less);
let btnZoomIn = document.getElementById("zoomIn");
btnZoomIn.addEventListener("click", ()=> {
    distance--;
    camera.position.z = distance;
    renderer.render( scene, camera );
})
let btnZoomOut = document.getElementById("zoomOut");
btnZoomOut.addEventListener("click", () => {
    distance++;
    camera.position.z = distance;
    renderer.render( scene, camera );
})

/**
 * Take the position of the mouse at the moment of clicking and then calculate the Bézier curve with the Casteljau algorithm.
 * @param {*} canvas 
 * @param {*} event 
 */
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();    //Get the size of canvas and his position on the screen 
    let Xaxis = distance * (event.clientX - rect.left - (canvas.width/2)) * 3/(canvas.width/2);
    let Yaxis = distance * (rect.top + (canvas.height/2) - event.clientY) * 3.8/(5* (canvas.height/2));
    droite.push( new THREE.Vector3( Xaxis, Yaxis, 0 ));
    majCasteljau();
}

/**
 * Draw lines between the points in the table. Show blue lines and green dots
 * @param {Array} tab 
 * @param {new THREE.LineBasicMaterial} material
 * @returns 
 */
function afficherDroite(tab, material = line){
    
    if(tab.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite
    const geometry = new THREE.BufferGeometry().setFromPoints(tab);  // On ajoute au buffer
    const figure = new THREE.Line( geometry, material );
    scene.add( figure ); // on ajoute à la scène tous les droites
    
    camera.position.z = distance;
    renderer.render( scene, camera );
    afficherPoints(tab);
}

/**
 * Read the coordinate input and calculate  Bézier curve with the Casteljau algorithm.
 */
function takeCoordonnees(){
    let coordonnees=document.getElementById("coordonnees").value;
    let StringofPoint=coordonnees;
    let tableau=StringofPoint.split(' ');
    for(let i=0;i<tableau.length;i++){
        if(tableau[i].includes(';')){
            let coord = tableau[i].split(';');
            droite.push(new THREE.Vector3(eval(coord[0]),eval(coord[1], 0 )) );
        }
    }
    majCasteljau();
}

function majCasteljau(){
    let finalTable = [];
    droite.forEach(elem => finalTable.push(Math.round(elem.x * 100) / 100, Math.round(elem.y * 100) / 100));
    casteljau(droite);
    if(document.getElementById("ListOfPoints").children.length == 2){
        document.getElementById("ListOfPoints").removeChild(document.getElementById("ListOfPoints").lastElementChild);
    }
    createTable(finalTable);
}

function createTable(tab){
        let form1=document.getElementById("ListOfPoints");
        let form = document.createElement("form");
        form.style.display="flex";
        form.style.flex="row";
        form1.appendChild(form); 
        let j=0
    for(let i=0;i<tab.length;i++){
        let ligne = document.createElement("input");
        ligne.setAttribute("class","form-control");
        ligne.style.display="flex";
        ligne.style.flexDirection="row";
        ligne.setAttribute("type", "input");
        ligne.setAttribute("name", "Point".i);
        ligne.setAttribute("label", "Point".i);
        ligne.value = tab[i]+';'+tab[i+1];
        ligne.setAttribute("id", j);
        ligne.style.height="23px";
        let label = document.createElement("Label");
        label.style.padding="0 5px 0 5px";
        label.style.width="40%";
        label.setAttribute("for",j);
        label.innerHTML = "Point "+ (j+1)+":";
        form.appendChild(label);
        form.appendChild(ligne);  
        i++,j++;
    }
    document.getElementById("weight").style.display = "block";
    let btnchange=document.getElementById("change");
    btnchange.style.display="block";
    btnchange.addEventListener("click", () => {
        changePoints(tab);
    });
}

function changePoints(tab){
    let x=0
    droite.splice(0, droite.length);
    for(let j=0;j<tab.length;j++){
        let tableau=(document.getElementById(x).value).split(';');
        droite.push(new THREE.Vector3(eval(tableau[0]),eval(tableau[1]), 0 ));
        x++
        j++;
    }
    casteljau(droite);
}
/**
 * Calculates the barycentre of the lines in the table and returns the point of the Bézier curve
 * @param {array} tab 
 * @param {integer} poids 
 * @returns {THREE.Vector3}
 */
function barycentre(tab, poids, print){
    if(tab.length == 1) return tab[0];
    let tabi = [];
    for(let i = 0; i < tab.length-1; i++){
        tabi.push(new THREE.Vector3((1-poids) * tab[i].x + poids * tab[i+1].x, (1-poids) * tab[i].y + poids * tab[i+1].y, 0));
    }
    if(print){
        afficherDroite(tabi, stepByStep);
        afficherPoints(tabi);
    }
    return barycentre(tabi, poids, print);
}

/**
 * Calculates and display Bézier curve with Casteljau algorithm
 * @param {array} tab 
 */
function casteljau(tab){
    casteljauPoints.splice(0, casteljauPoints.length);

    for(let t = 0; t < 1; t+=0.001){
        casteljauPoints.push(barycentre(tab, t, false));
    }
    refresh();
}

function more(){
    refresh();
    let t = document.getElementById("poids");
    let val = eval(t.innerHTML.substr(9));
    if(val < 1){
        val = Math.trunc((val * 100) + 5)/100;
        t.innerHTML = "Poids : "+val;
        barycentre(droite, val, true);
    }
}

function less(){
    refresh();
    let t = document.getElementById("poids");
    let val = eval(t.innerHTML.substr(9));
    if(val > 0){
        val = Math.trunc((val * 100) - 5)/100;
        t.innerHTML = "Poids : "+val;
        barycentre(droite, val, true);
    }
}

function refresh(){
    reset();
    afficherDroite(droite);
    afficherPoints(casteljauPoints);
    afficherPoints(points);
}