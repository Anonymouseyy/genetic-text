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

function getFitness(str, target) {
    let correct = 0;
    let total = target.length;

    for (i in target) {
        if (str.charAt(i) === target.charAt(i)) {
            correct++;
        }
    }

    return correct/total;
}



document.getElementById("start").addEventListener("click", () => {
    document.getElementById("generations").innerText = "Total Generations: 0";
    document.getElementById("avgFitness").innerText = "Average Fitness: 0%";
    document.getElementById("allPhrases").innerText = "";
    document.getElementById("bestPhrase").innerText = "";

    let popSize = document.getElementById("population").value;
    let mutRate = document.getElementById("mutationRate").value;
    let targetPhrase = document.getElementById("target").value;
    runSimulation(popSize, mutRate, targetPhrase);
});


async function runSimulation(popSize, mutRate, targetPhrase) {
    const length = targetPhrase.length;
    let population = [];
    for (let i = 0; i < popSize; i++) {
        population.push(generateRandomString(length))
    }
    document.getElementById("allPhrases").innerText += population.join("  |  ");

    let fitness = [];
    let totalFitScore = 0;
    let bestScore = -1;
    let bestPhrase;
    for (i in population) {
        let x = getFitness(population[i], targetPhrase)

        if (x === 1) {
            return;
        }
        if (x > bestScore) {
            bestPhrase = population[i];
            bestScore = x;
        }

        fitness.push(x);
        totalFitScore += x;
    }

    let totalGenerations = 1;
    let avgFitness = totalFitScore/popSize;
    document.getElementById("generations").innerText = `Total Generations: ${totalGenerations}`;
    document.getElementById("avgFitness").innerText = `Average Fitness: ${(avgFitness*100).toFixed(2)}%`;
    document.getElementById("bestPhrase").innerText = bestPhrase;
}