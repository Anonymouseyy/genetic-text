const characters = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomString(length) {
    let result = "";
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
}



document.getElementById("start").addEventListener("click", () => {
    document.getElementById("generations").innerText = "Total Generations: 0";
    document.getElementById("avgFitness").innerText = "Average Fitness: 0%";
    document.getElementById("allPhrases").innerText = "";

    let popSize = document.getElementById("population").value;
    let mutRate = document.getElementById("mutationRate").value;
    let targetPhrase = document.getElementById("target").value;
    runSimulation(popSize, mutRate, targetPhrase);
});


async function runSimulation(popSize, mutRate, targetPhrase) {
    const length = targetPhrase.length;
    console.log(length);
    let population = [];
    for (let i = 0; i < popSize; i++) {
        population.push(generateRandomString(length))
    }
    document.getElementById("allPhrases").innerText += population.join("  |  ");
}