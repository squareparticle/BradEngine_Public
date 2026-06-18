let population = [
    {dna:"unicron", probability:10, count:0},
    {dna:"popcorn", probability:40, count:0},
    {dna:"aaaaaah", probability:30, count:0},
    {dna:"isotope", probability:20, count:0}
]

for(let i=0; i<100; i++){
    Tools.getRandomObjectByProbability(population).count++;
}        
for(let i=0; i<population.length; i++){
    console.log(population[i].dna,population[i].count);
}