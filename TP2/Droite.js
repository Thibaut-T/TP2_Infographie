let button_coordonnees=document.getElementById("1")
button_coordonnees.addEventListener("click",afficherDroite);



function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();    //Get the size of canvas and his position on the screen 
    let Xaxis = event.clientX - rect.left;        //Take the X coordonate of the click and subtract it from the left side of the canvas
    let Yaxis = event.clientY - rect.top;
    droite.push( new THREE.Vector3( Xaxis, Yaxis, 0 ));
    afficherDroite();
    console.log("Coordinate x: " + Xaxis + "Coordinate y: " + Yaxis);
}

function afficherDroite(){
    let coordonnees=document.getElementById("coordonnees").value;
    console.log(coordonnees);
    let StringofPoint=coordonnees;
    let reg=new RegExp("[ ,;]+", "g"); //A revoir , faudra recup les points ecris de manière (A,B)(C,D) etc etc 
    let tableau=StringofPoint.split(reg);
    console.log(tableau);
    if(droite.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite
    const geometry = new THREE.BufferGeometry().setFromPoints(droite);  // On ajoute au buffer
    
    const figure = new THREE.Line( geometry, line );
    scene.add( figure ); // on ajoute à la scène tous les droites
    
    camera.position.z = 5;
    renderer.render( scene, camera );
}