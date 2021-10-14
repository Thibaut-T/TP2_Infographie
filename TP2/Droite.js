const line = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0x0000FF
})
const droite = []; // Tableau de points pour la droite

let coordonnees=document.getElementById("coordonnees");

let button_coordonnees=document.getElementById("1");
button_coordonnees.addEventListener("click",afficherDroite);

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();    //Get the size of canvas and his position on the screen 
    let Xaxis = distance * (event.clientX - rect.left - (canvas.width/2)) * 3/(canvas.width/2);
    let Yaxis = distance * (rect.top + (canvas.height/2) - event.clientY) * 3.8/(5* (canvas.height/2));
    droite.push( new THREE.Vector3( Xaxis, Yaxis, 0 ));
    afficherDroite(droite);
}

function afficherDroite(tab){
    
    if(tab.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite
    const geometry = new THREE.BufferGeometry().setFromPoints(tab);  // On ajoute au buffer
    const figure = new THREE.Line( geometry, line );
    scene.add( figure ); // on ajoute à la scène tous les droites
    
    camera.position.z = distance;
    renderer.render( scene, camera );
    afficherPoints(tab);
}

function takeCoordonnees(){
    let coordonnees=document.getElementById("coordonnees").value;
    let StringofPoint=coordonnees;
    let tableau=StringofPoint.split(' ');
    for(let i=0;i<tableau.length;i++){
        droite.push(new THREE.Vector3(eval(tableau[i]),eval(tableau[i+1], 0 )) );
        i++;
    }
    afficherDroite(droite);
    casteljau(droite);
}

function barycentre(tab, poids){
    if(tab.length == 1) return tab[0];
    let tabi = [];
    for(let i = 0; i < tab.length-1; i++){
        tabi.push(new THREE.Vector3((1-poids) * tab[i].x + poids * tab[i+1].x, (1-poids) * tab[i].y + poids * tab[i+1].y, 0));
    }
    return barycentre(tabi, poids);
}

function casteljau(tab){
    let tabPoints = [];

    for(let t = 0; t < 1; t+=0.001){
        tabPoints.push(barycentre(tab, t));
    }
    
    afficherPoints(tabPoints);
}