const line = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0x0000FF
})
const droite = []; // Tableau de points pour la droite

let coordonnees=document.getElementById("coordonnees");

let button_coordonnees=document.getElementById("1");
button_coordonnees.addEventListener("click",afficherDroite);

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
    reset();
    afficherDroite(droite);
    casteljau(droite);
}

/**
 * Draw lines between the points in the table. Show blue lines and green dots
 * @param {Array} tab 
 * @returns 
 */
function afficherDroite(tab){
    
    if(tab.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite
    const geometry = new THREE.BufferGeometry().setFromPoints(tab);  // On ajoute au buffer
    const figure = new THREE.Line( geometry, line );
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
    let finalTable = [];
    for(let i=0;i<tableau.length;i++){
        console.log(tableau[i]);
        if(tableau[i].includes(';')){
            let coord = tableau[i].split(';');
            droite.push(new THREE.Vector3(eval(coord[0]),eval(coord[1], 0 )) );
            console.log(coord);
            finalTable.push(coord[0], coord[1]);
        }
    }
    reset();
    afficherDroite(droite);
    casteljau(droite);
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
        label.style.width="30%";
        label.setAttribute("for",j);
        label.innerHTML = "Point "+ (j+1)+":";
        form.appendChild(label);
        form.appendChild(ligne);  
        i++,j++;
    }
    let btnchange=document.getElementById("change");
    btnchange.style.display="block";
    btnchange.addEventListener("click", () => {
        changePoints(tab);
    });
}

function changePoints(tab){
    reset();
    console.log(tab);
    let x=0
    let newTab=[];
    for(let j=0;j<tab.length;j++){
        console.log(document.getElementById(x).value)
        let tableau=(document.getElementById(x).value).split(';');
        console.log(tableau[x]);
        newTab.push(new THREE.Vector3(eval(tableau[0]),eval(tableau[1]), 0 ));
        x++
        j++;
    }
    reset();
    afficherDroite(newTab);
    casteljau(newTab);
}
/**
 * Calculates the barycentre of the lines in the table and returns the point of the Bézier curve
 * @param {array} tab 
 * @param {integer} poids 
 * @returns {THREE.Vector3}
 */
function barycentre(tab, poids){
    if(tab.length == 1) return tab[0];
    let tabi = [];
    for(let i = 0; i < tab.length-1; i++){
        tabi.push(new THREE.Vector3((1-poids) * tab[i].x + poids * tab[i+1].x, (1-poids) * tab[i].y + poids * tab[i+1].y, 0));
    }
    return barycentre(tabi, poids);
}

/**
 * Calculates and display Bézier curve with Casteljau algorithm
 * @param {array} tab 
 */
function casteljau(tab){
    let tabPoints = [];

    for(let t = 0; t < 1; t+=0.001){
        tabPoints.push(barycentre(tab, t));
    }
    
    afficherPoints(tabPoints);
    afficherPoints(points);
}