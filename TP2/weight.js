let poids = document.getElementById("poids");
poids.addEventListener("input", weight);

function weight() {
    refresh();
    let val = eval(document.getElementById("poids").value);
    if (val != -1 && val != 101) {
        val /= 100;
        barycentre(droite, val, true);
    }
}