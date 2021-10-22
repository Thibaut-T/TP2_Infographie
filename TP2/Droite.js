const line = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0x0000FF
})

const stepByStep = new THREE.LineBasicMaterial({ //définition taille et couleurs des lignes
    linewidth: 0.05,
    color: 0xCD0300
})

const droite = []; // Tableau de points pour la droite

let homothetie = document.getElementById("homot");
homothetie.addEventListener("input", transformation);

let translation = document.getElementById("trans");
translation.addEventListener("input", transformation);

let rotation = document.getElementById("rot");
rotation.addEventListener("input", transformation);

/**
 * Take the position of the mouse at the moment of clicking and then calculate the Bézier curve with the Casteljau algorithm.
 * @param {*} canvas 
 * @param {*} event 
 */
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();    //Get the size of canvas and his position on the screen 
    let transVal = eval(translation.value), homotVal = eval(homothetie.value) / 100;
    let Xaxis = ((cam.z * (event.clientX - rect.left - (canvas.width / 2)) * 3 / (canvas.width / 2)) + cam.x - transVal) / homotVal;
    let Yaxis = ((cam.z * (rect.top + (canvas.height / 2) - event.clientY) * 3.8 / (5 * (canvas.height / 2))) + cam.y) / homotVal;
    droite.push(new THREE.Vector3(Xaxis, Yaxis, 0));
    majCasteljau();
}

/**
 * Draw lines between the points in the table. Show blue lines and green dots
 * @param {Array} tab 
 * @param {new THREE.LineBasicMaterial} material
 * @returns 
 */
function afficherDroite(tab, material = line) {

    if (tab.lenght < 2) return; // On vérifie qu'on a assez de points pour faire un droite

    let newTab = [], transVal = eval(translation.value), homotVal = eval(homothetie.value), rotVal = eval(rotation.value);
    
    tab.forEach(elem => {
        //newTab.push(new THREE.Vector3(Math.trunc((elem.x + transVal) * homotVal * Math.cos(Math.PI*rotVal/180)) / 100, Math.trunc(elem.y * homotVal * Math.sin(Math.PI*rotVal/180)) / 100, elem.z))
    
        let x = Math.trunc((elem.x + transVal) * homotVal) / 100;
        let y = Math.trunc(elem.y * homotVal) / 100;
        newTab.push(new THREE.Vector3(x*Math.cos(Math.PI*rotVal/180) - y * Math.sin(Math.PI*rotVal/180) , y*Math.cos(Math.PI*rotVal/180) - y * Math.sin(Math.PI*rotVal/180), elem.z))
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(newTab);  // On ajoute au buffer
    const figure = new THREE.Line(geometry, material);
    scene.add(figure); // on ajoute à la scène tous les droites

    camera.position.x = cam.x;
    camera.position.y = cam.y;
    camera.position.z = cam.z;
    renderer.render(scene, camera);
    afficherPoints(tab);
}

/**
 * Read the coordinate input and calculate  Bézier curve with the Casteljau algorithm.
 */
function takeCoordonnees() {
    let coordonnees = document.getElementById("coordonnees").value;
    let StringofPoint = coordonnees;
    let tableau = StringofPoint.split(' ');
    let transVal = eval(translation.value), homotVal = eval(homothetie.value) / 100;
    for (let i = 0; i < tableau.length; i++) {
        if (tableau[i].includes(';')) {
            let coord = tableau[i].split(';');
            droite.push(new THREE.Vector3((eval(coord[0]) - transVal) / homotVal, eval(coord[1]) / homotVal, 0));
        }
    }
    majCasteljau();
}



function createTable(tab) {
    let form1 = document.getElementById("ListOfPoints");
    let form = document.createElement("form");
    form.style.display = "flex";
    form.style.flex = "row";
    form1.appendChild(form);
    let j = 0
    for (let i = 0; i < tab.length; i++) {
        let ligne = document.createElement("input");
        ligne.setAttribute("class", "form-control");
        ligne.style.display = "flex";
        ligne.style.flexDirection = "row";
        ligne.setAttribute("type", "input");
        ligne.setAttribute("name", "Point".i);
        ligne.setAttribute("label", "Point".i);
        ligne.value = tab[i] + ';' + tab[i + 1];
        ligne.setAttribute("id", j);
        ligne.style.height = "23px";
        let label = document.createElement("Label");
        label.style.padding = "0 5px 0 5px";
        label.style.width = "40%";
        label.setAttribute("for", j);
        label.innerHTML = "Point " + (j + 1) + ":";
        form.appendChild(label);
        form.appendChild(ligne);
        i++, j++;
    }
    document.getElementById("weight").style.display = "block";
    let btnchange = document.getElementById("change");
    btnchange.style.display = "block";
    btnchange.addEventListener("click", () => {
        changePoints(tab);
    });
}

function changePoints(tab) {
    let x = 0
    droite.splice(0, droite.length);
    for (let j = 0; j < tab.length; j++) {
        let tableau = (document.getElementById(x).value).split(';');
        droite.push(new THREE.Vector3(eval(tableau[0]), eval(tableau[1]), 0));
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

function refresh() {
    reset();

    afficherDroite(droite);
    afficherPoints(casteljauPoints);
    afficherPoints(points);
}

function transformation() {
    let transVal = eval(translation.value);
    let homotVal = eval(homothetie.value);
    let rotVal = eval(rotation.value);
    console.log(transVal, homotVal);
    document.getElementById("transOutputId").value = transVal;
    document.getElementById("homotOutputId").value = homotVal / 100;
    document.getElementById("rotOutputId").value = rotVal+"°";
    for (let i = 0; i < droite.length; i++) {
        document.getElementById(i).value = (Math.trunc((droite[i].x + transVal) * homotVal)) / 100 + ";" + (Math.trunc((droite[i].y) * homotVal) / 100);
    }
    refresh();
}