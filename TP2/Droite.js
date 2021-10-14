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
    let Xaxis = event.clientX - rect.left - (canvas.width/2);        //Take the X coordonate of the click and subtract it from the left side of the canvas
    let Yaxis = rect.top + (canvas.height/2) - event.clientY;
    droite.push( new THREE.Vector3( Xaxis/(128/3), Yaxis/(2335/38), 0 ));
    afficherDroite();
    console.log(event.clientX + " - " + rect.left + " - " + (canvas.width/2) + " = " + Xaxis/(128/3) + " " + rect.top + " + " + (canvas.height/2) + " - " + event.clientY + " = " + Yaxis/(2335/38));
}

function afficherDroite(){
    let coordonnees=document.getElementById("coordonnees").value;
    console.log(coordonnees);
    let StringofPoint=coordonnees;
    let tableau=StringofPoint.split(' ');
    console.log(tableau);
    for(let i=0;i<tableau.length;i++){
        droite.push(new THREE.Vector3(eval(tableau[i]),eval(tableau[i+1], 0 )) );
        console.log(droite[droite.length-1]);
        i++;
    }
    console.log(droite);
    //afficherCourbe(droite);
    if(droite.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite
    const geometry = new THREE.BufferGeometry().setFromPoints(droite);  // On ajoute au buffer
    const figure = new THREE.Line( geometry, line );
    scene.add( figure ); // on ajoute à la scène tous les droites
    camera.position.z = 5;
    renderer.render( scene, camera );
}

function Decasteljau(pdc){
    let pointBezier=[];
    for(i=0;i<pdc.length;i++){
        pointBezier[i]=pdc[i];
    }
}