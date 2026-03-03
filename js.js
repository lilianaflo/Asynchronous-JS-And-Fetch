// used to store current pokemon
let currentPokemon = null;

// when the form is submitted, fetch from Pokemon API
function doFetch(event){
    event.preventDefault(); //page won't refresh after submit

    const input = document.getElementById("nameIDIn").value.toLowerCase().trim();

    // local caching to store data
    const cache = `pokemon_${input}`;

    // attempting to check local storage for data
    const cachedData = localStorage.getItem(cache);
    if(cachedData){
        // converting the saved string to a js object
        const data = JSON.parse(cachedData);
        // saving
        currentPokemon = data;
        // display
        loadPokemon(data);

        return;
    }
    // fetch from Poke API if not found locally
    fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
        .then(response => {
            if(!response.ok){
                throw new Error("Could not fetch");
            }
            // parse response in JSON
            return response.json();
        })
        .then(data => {
            // global save
            currentPokemon = data;

            // store locally:
            localStorage.setItem(cache, JSON.stringify(data));

            // display pokemon call
            loadPokemon(data);
        })

}

// displaying the pokemon
function loadPokemon(data){
    // get the image from the api
    const img = data.sprites.front_default;
    const image = document.getElementById("pokemonImage");
    // set the src to img
    image.src = img;
    // display the image
    image.style.display = "block";

    // grabbing both types of audio: legacy and latest
    const cry = data.cries.legacy;
    const cry2 = data.cries.latest;
    const cries = document.getElementById("pokemonCry");
    // set the src: whichever exists
    cries.src = cry || cry2;

    // loading the moves: go through each move in
    // the API array and get the name
    const moveNames = data.moves.map(m => m.move.name);
    // grabs all drop down options
    const dropdowns = [
        document.getElementById("moves"),
        document.getElementById("moves2"),
        document.getElementById("moves3"),
        document.getElementById("moves4")
    ];

    // loop through each one, clear previous,
    // and add each move
    dropdowns.forEach(select => {
        select.innerHTML = "";

        // moveNames - array of strings: create a new option and set
        // the value of the option (move) and use textContent
        // to show it to the user
        moveNames.forEach(move => {
            const option = document.createElement("option");
            option.value = move;
            option.textContent = move;
            select.appendChild(option);
        });
    });
}

// adding the pokemon to the team table
function appendPokemon(){
    // when user adds to team, this function adds
    // the image and moves to the table

    // creating a new row/cell
    const table = document.getElementById("teamTable");
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    // image: setting source and display, appending item
    const img = document.createElement("img");
    img.src = currentPokemon.sprites.front_default;
    img.width = 100;
    cell.appendChild(img);

    // moves references
    const selectedMoves = [
        document.getElementById("moves").value,
        document.getElementById("moves2").value,
        document.getElementById("moves3").value,
        document.getElementById("moves4").value
    ];

    // display moves and add to list
    const ul = document.createElement("ul");
    selectedMoves.forEach(move => {
        const li = document.createElement("li");
        li.textContent = move;
        ul.appendChild(li);
    });
    cell.appendChild(ul);

    // add information to the cell and append to row
    // take the row and append to the table
    row.appendChild(cell);
    table.appendChild(row);

    // the table is now visible
    document.getElementById("tableSection").style.display = "block";
}
// event listener for appending the pokemon
document.getElementById("addBtn").addEventListener("click", appendPokemon);