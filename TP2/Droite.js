const line = new THREE.LineBasicMaterial({
  // Definine size/color of the polynomial
  linewidth: 0.05,
  color: 0x0000ff,
});

const stepByStep = new THREE.LineBasicMaterial({ //Define size/color of lines
    linewidth: 0.05,
    color: 0xCD0300
})

const droite = []; // Array of control polynomial points

let homothetie = document.getElementById("homot");      // To recover the value of the homothety
homothetie.addEventListener("input", transformation);

let translationX = document.getElementById("transX");   // To recover the value of the translation at x
translationX.addEventListener("input", transformation);
let translationY = document.getElementById("transY");   // To recover the value of the translation at y
translationY.addEventListener("input", transformation);

let rotation = document.getElementById("rot");          // To recover the value of the rotation
rotation.addEventListener("input", transformation);

/**
 * Take the position of the mouse at the moment of clicking and then calculate the Bézier curve with the Casteljau algorithm.
 * @param {*} canvas 
 * @param {*} event 
 */
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();    //Get the size of canvas and his position on the screen 
    let transXVal = eval(translationX.value), transYVal = eval(translationY.value), homotVal = eval(homothetie.value) / 100, rotVal = eval(rotation.value), alpha = Math.PI*rotVal/180;
    let Xaxis = ((cam.z * (event.clientX - rect.left - (canvas.width / 2)) * 3 / (canvas.width / 2)) + cam.x - transXVal) / homotVal;           // The values for translation, homothety must be removed
    let Yaxis = ((cam.z * (rect.top + (canvas.height / 2) - event.clientY) * 3.8 / (5 * (canvas.height / 2))) + cam.y - transYVal) / homotVal;
    let y = Yaxis * Math.cos(alpha) - Xaxis * Math.sin(alpha);  // Same for rotation
    let x = (Xaxis + y * Math.sin(alpha))/Math.cos(alpha);
    droite.push(new THREE.Vector3(x, y, 0));
    majCasteljau();
}

/**
 * Draw lines between the points in the table. Show blue lines and green dots
 * @param {Array} tab 
 * @param {new THREE.LineBasicMaterial} material
 * @returns 
 */
function afficherDroite(tab, material = line) {

    let newTab = [], transXVal = eval(translationX.value), transYVal = eval(translationY.value), homotVal = eval(homothetie.value), rotVal = eval(rotation.value), alpha = Math.PI*rotVal/180;
    
    tab.forEach(elem => {
        let x = Math.trunc((elem.x + transXVal) * homotVal) / 100; // The values for translation, homothety must be added
        let y = Math.trunc((elem.y + transYVal) * homotVal) / 100;
        newTab.push(new THREE.Vector3(Math.trunc((x*Math.cos(alpha) - y * Math.sin(alpha))*100)/100 , Math.trunc((x*Math.sin(alpha) + y * Math.cos(alpha))*100)/100, elem.z)); // Same for rotation
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(newTab);  // On ajoute au buffer
    const figure = new THREE.Line(geometry, material);
    scene.add(figure); // Add scene to all the line

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
    let transXVal = eval(translationX.value), transYVal = eval(translationY.value), homotVal = eval(homothetie.value) / 100, rotVal = eval(rotation.value), alpha = Math.PI*rotVal/180;
    for (let i = 0; i < tableau.length; i++) {
        if (tableau[i].includes(';')) {
            let coord = tableau[i].split(';');
            let Xaxis = (eval(coord[0]) - transXVal) / homotVal; // The values for translation, homothety must be removed
            let Yaxis = (eval(coord[1]) - transYVal) / homotVal;
            let y = Yaxis * Math.cos(alpha) - Xaxis * Math.sin(alpha); // Same for rotation
            let x = (Xaxis + y * Math.sin(alpha))/Math.cos(alpha);
            droite.push(new THREE.Vector3(x , y, 0));
        }
    }
    majCasteljau();
}

/**
 * Displays all control points
 * @param {Array} tab 
 */
function createTable(tab) {
    let form1 = document.getElementById("ListOfPoints");
    let form = document.createElement("form");
    form.style.display = "flex";
    form.style.flex = "row";
    form1.appendChild(form);
    let j = 0
    for (let i = 0; i < tab.length; i++) {
        let ligne = document.createElement("input");  // For each point create a input element
        ligne.setAttribute("class", "form-control");
        ligne.style.display = "flex";
        ligne.style.flexDirection = "row";
        ligne.setAttribute("type", "input");
        ligne.setAttribute("name", "Point".i);
        ligne.setAttribute("label", "Point".i);
        ligne.value = tab[i] + ';' + tab[i + 1];
        ligne.setAttribute("id", j);
        ligne.style.height = "23px";                        //Just add style in CSS
        let label = document.createElement("Label");        
        label.style.padding = "0 5px 0 5px";
        label.style.width = "40%";
        label.setAttribute("for", j);
        label.innerHTML = "Point " + (j + 1) + ":";
        form.appendChild(label);
        form.appendChild(ligne);
        i++, j++;
    }
    // Change button
    document.getElementById("weight").style.display = "block";
    let btnchange = document.getElementById("change");
    btnchange.style.display = "block";
    btnchange.addEventListener("click", () => {
        changePoints(tab);
    });
}

/**
 * If we want to change a control point
 * @param {Array} tab 
 */
function changePoints(tab) {
    let x = 0, transXVal = eval(translationX.value), transYVal = eval(translationY.value), homotVal = eval(homothetie.value) / 100, rotVal = eval(rotation.value), alpha = Math.PI*rotVal/180;
    droite.splice(0, droite.length);
    for (let j = 0; j < tab.length; j++) {
        //get coordonate of changing points just above
        let tableau = (document.getElementById(x).value).split(';');
        //x.value =(3;2 4;2) ===> change into tableau[3,2,4,2];
        let Xaxis = (eval(tableau[0]) - transXVal) / homotVal;    // The values for translation, homothety must be removed
        let Yaxis = (eval(tableau[1]) - transYVal) / homotVal;
        let coordY = Yaxis * Math.cos(alpha) - Xaxis * Math.sin(alpha);  // Same for rotation
        let coordX = (Xaxis + y * Math.sin(alpha))/Math.cos(alpha);
        droite.push(new THREE.Vector3(coordX , coordY, 0));
        x++
        j++;
    }
    casteljau(droite);
}

/**
 * Manages the display
 */
function refresh() {
    reset();

    afficherDroite(droite);
    afficherPoints(casteljauPoints);
    afficherPoints(points);
}

/**
 * Modifies the display when changing translation, homothety or rotation
 */
function transformation() {
    let transXVal = eval(translationX.value);
    let transYVal = eval(translationY.value);
    let homotVal = eval(homothetie.value);
    let rotVal = eval(rotation.value);
    let alpha = Math.PI*rotVal/180;

    // Display of the new value
    document.getElementById("transXOutputId").value = transXVal;
    document.getElementById("transYOutputId").value = transYVal;
    document.getElementById("homotOutputId").value = homotVal / 100;
    document.getElementById("rotOutputId").value = rotVal+"°";

    for (let i = 0; i < droite.length; i++) {
        let x = (Math.trunc((droite[i].x + transXVal) * homotVal)) / 100;  // The values for translation, homothety must be removed
        let y = (Math.trunc((droite[i].y + transYVal) * homotVal)) / 100;
        document.getElementById(i).value = (Math.trunc((x*Math.cos(alpha) - y * Math.sin(alpha))*100)/100) + ";" + (Math.trunc((x*Math.sin(alpha) + y * Math.cos(alpha))*100)/100);  // Same for rotation
    }
    refresh();
}