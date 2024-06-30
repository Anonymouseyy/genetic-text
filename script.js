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

function cross(str1, str2) {
    let l = str1.length;
    return str1.slice(0, Math.floor(l/2)) + str2.slice(Math.floor(l/2))
}

function selectRandom(probabilities, sum=undefined) {
    // Select from population based on fitness probability
    if (sum === undefined) {
        probabilities.reduce((a, b) => a + b, 0)
    }

    let winner = Math.random()*totalFitScore;
    let threshold = 0;
    for (let i = 0; i < probabilities.length; i++) {
        threshold += parseFloat(probabilities[i]);
        if (threshold > winner) {
            return i;
        }
    }

}

function mutate(str, mutRate) {
    const charactersLength = characters.length;

    for (i in str) {
        if (Math.random() < mutRate) {
            str = str.substring(0, i) + 
            characters.charAt(Math.floor(Math.random() * charactersLength)) + 
            str.substring(index+1);
        }
        
    }
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

    while(true) {
        let newPop = []
        for (let i = 0; i < popSize; i++) {
            newPop.push(
                mutate(
                    cross(population[selectRandom(fitness, totalFitScore)], population[selectRandom(fitness, totalFitScore)]
                ), mutRate)
            );
        }

        
    }
}