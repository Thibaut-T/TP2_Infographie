let poids = document.getElementById("poids");
let poidsOutput = document.getElementById("weightOutputId");
poids.addEventListener("input", weight);

/**
 * Calculates and displays the points found for a given weight
 */
function weight() {
    refresh();
    let val = eval(document.getElementById("poids").value);
    if (val != -1 && val != 101) {
        val /= 100;
        barycentre(droite, val, true);
        poidsOutput.value = val;
    }
}