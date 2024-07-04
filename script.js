const characters = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.?!";
let cancel = false;

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

function crossHalfHalf(str1, str2) {
    let l = str1.length;
    return str1.slice(0, Math.floor(l/2)) + str2.slice(Math.floor(l/2));
}

function crossMixed(str1, str2) {
    let ret = "";
    
    for (let i = 0; i < str1.length; i++) {
        if (i%2 === 0) {
            ret += str1.charAt(i);
        } else {
            ret += str2.charAt(i);
        }
    }

    return ret;
}

function selectRandom(probabilities, sum=undefined) {
    // Select from population based on fitness probability
    if (sum === undefined) {
        probabilities.reduce((a, b) => a + b, 0)
    }

    let winner = Math.random()*sum;
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

    for (let i = 0; i < str.length; i++) {
        if (Math.random() < mutRate) {
            str = str.substring(0, i) + characters.charAt(Math.floor(Math.random() * charactersLength)) + str.substring(i+1);
        }
    }

    return str;
}



document.getElementById("start").addEventListener("click", () => {
    document.getElementById("generations").innerText = "Total Generations: 0";
    document.getElementById("avgFitness").innerText = "Average Fitness: 0%";
    document.getElementById("allPhrases").innerText = "";
    document.getElementById("bestPhrase").innerText = "";

    let popSize = document.getElementById("population").value;
    let mutRate = document.getElementById("mutationRate").value;
    let targetPhrase = document.getElementById("target").value;
    runSimulation(popSize, mutRate, targetPhrase, "run");
});

document.getElementById("step").addEventListener("click", () => {
    document.getElementById("generations").innerText = "Total Generations: 0";
    document.getElementById("avgFitness").innerText = "Average Fitness: 0%";
    document.getElementById("allPhrases").innerText = "";
    document.getElementById("bestPhrase").innerText = "";

    let popSize = document.getElementById("population").value;
    let mutRate = document.getElementById("mutationRate").value;
    let targetPhrase = document.getElementById("target").value;
    runSimulation(popSize, mutRate, targetPhrase, "step");
});

document.getElementById("cancel").addEventListener("click", () => {
    cancel = true;

    setTimeout(() => { 
        cancel = false; 
        document.getElementById("generations").innerText = "Total Generations: 0";
        document.getElementById("avgFitness").innerText = "Average Fitness: 0%";
        document.getElementById("allPhrases").innerText = "";
        document.getElementById("bestPhrase").innerText = "";
    }, 10);
});


function setupSimulation(popSize, targetPhrase) {
    // transfer bestPhrase, bestScore, totalFitScore
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
    let success = false;
    for (i in population) {
        let x = getFitness(population[i], targetPhrase)

        if (x > bestScore) {
            bestPhrase = population[i];
            bestScore = x;
        }
        if (x == 1) {
            bestPhrase = population[i];
            bestScore = x;
            success = true;
        }

        fitness.push(x);
        totalFitScore += x;
    }

    let totalGenerations = 1;
    let avgFitness = totalFitScore/popSize;
    document.getElementById("generations").innerText = `Total Generations: ${totalGenerations}`;
    document.getElementById("avgFitness").innerText = `Average Fitness: ${(avgFitness*100).toFixed(2)}%`;
    document.getElementById("bestPhrase").innerText = bestPhrase;

    return [bestPhrase, bestScore, totalFitScore, population, fitness, totalGenerations, avgFitness, success];
}

function runSimulationStep(bestPhrase, bestScore, totalFitScore, population, fitness, popSize, mutRate, targetPhrase, totalGenerations, avgFitness) {
    let newPop = [];
    for (let i = 0; i < popSize; i++) {
        if (Math.random() < 0.5) {
            newPop.push(
                mutate(
                    crossHalfHalf(population[selectRandom(fitness, totalFitScore)], population[selectRandom(fitness, totalFitScore)]
                ), mutRate)
            );
        } else {
            newPop.push(
                mutate(
                    crossMixed(population[selectRandom(fitness, totalFitScore)], population[selectRandom(fitness, totalFitScore)]
                ), mutRate)
            );
        }
    }
    console.log(newPop)

    population = newPop;
    document.getElementById("allPhrases").innerText = population.join("  |  ") + document.getElementById("allPhrases").innerText;

    fitness = [];
    totalFitScore = 0;
    let success = false;
    for (i in population) {
        let x = getFitness(population[i], targetPhrase)
        
        if (x > bestScore) {
            bestPhrase = population[i];
            bestScore = x;
        }
        if (x == 1) {
            bestPhrase = targetPhrase;
            bestScore = x;
            success = true;
        }
            

        fitness.push(x);
        totalFitScore += x;
    }

    totalGenerations++;
    avgFitness = (avgFitness + (totalFitScore/popSize))/2;
    document.getElementById("generations").innerText = `Total Generations: ${totalGenerations}`;
    document.getElementById("avgFitness").innerText = `Average Fitness: ${(avgFitness*100).toFixed(2)}%`;
    document.getElementById("bestPhrase").innerText = bestPhrase;

    return [bestPhrase, bestScore, totalFitScore, population, fitness, totalGenerations, avgFitness, success];
}


async function runSimulation(popSize, mutRate, targetPhrase, type) {
    let [bestPhrase, bestScore, totalFitScore, population, fitness, totalGenerations, avgFitness, success] = setupSimulation(popSize, targetPhrase);
    if (success) {
        return;
    }

    while(true) {
        if (type === "run") {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        if (type === "step") {
            await new Promise(resolve => document.getElementById("next").addEventListener("click", () => {
                resolve();
            }, {once: true}));
        }
        [bestPhrase, bestScore, totalFitScore, population, fitness, totalGenerations, avgFitness, success] = runSimulationStep(bestPhrase, bestScore, totalFitScore, population, fitness, popSize, mutRate, targetPhrase, totalGenerations, avgFitness);

        if (cancel) { return; }

        if (success) {
            return;
        } 
    }
}