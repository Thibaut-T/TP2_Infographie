const casteljauPoints = []; // Tableau de points pour la courbe avec l'olgo de Casteljau

function barycentre(tab, poids, print) {
    if (tab.length == 1) return tab[0];
    let tabi = [];
    for (let i = 0; i < tab.length - 1; i++) {
        tabi.push(new THREE.Vector3((1 - poids) * tab[i].x + poids * tab[i + 1].x, (1 - poids) * tab[i].y + poids * tab[i + 1].y, 0));
    }
    if (print) {
        afficherDroite(tabi, stepByStep);
        afficherPoints(tabi);
    }
    return barycentre(tabi, poids, print);
}

/**
 * Calculates and display Bézier curve with Casteljau algorithm
 * @param {array} tab 
 */
function casteljau(tab) {
    casteljauPoints.splice(0, casteljauPoints.length);

    for (let t = 0; t < 1; t += 0.001) {
        casteljauPoints.push(barycentre(tab, t, false));
    }
    refresh();
}

function majCasteljau() {
    let finalTable = [];
    droite.forEach(elem => finalTable.push(Math.round(elem.x * 100) / 100, Math.round(elem.y * 100) / 100));
    casteljau(droite);
    if (document.getElementById("ListOfPoints").children.length == 2) {
        document.getElementById("ListOfPoints").removeChild(document.getElementById("ListOfPoints").lastElementChild);
    }
    createTable(finalTable);
}