// Declaring varaibles for DOM manipulation
let form = document.querySelector('#search')
let field = document.getElementById('input')
let grid = document.getElementById('grid')
let clear = document.getElementById('clear')
let res = 0
let error = 0

document.body.style.backgroundColor = "blue"

// Eventlistener for storing the response from the API call
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let children = Array.from(grid.children)
    children.forEach(elem => elem.remove())
    let searchTerm = field.value
    let config = {params: {q: searchTerm}}
    res = await axios.get(`http://api.tvmaze.com/search/shows?`, config)
    field.value = ''
    
    if(res.data.length === 0){
        clear.style.display = 'none'
        error = document.createElement('div')
        error.className = "error"
        error.innerText = '~ TV SHOW NOT FOUND ~'
        grid.append(error) 
        setTimeout(() => {
            error.innerText = ''
        }, 4000)
        // error.innerText = '~ NO RESULTS ~'   
    }
    else if(res.data.length > 0){
        clear.style.display = 'block'
        savedata()
    }
    console.log(res.data)
    display(res.data)
    savedata()
})

// Function for clearing the search results container 
clear.addEventListener('click', () => {
    let children = Array.from(grid.children)
    children.forEach(elem => elem.remove())
    clear.style.display = 'none'
    savedata()
})

// Function for extracting and displaying the image, rating, genre and url of the search results from the API
let display = (data) => {
    for(let result of data){
        if(result.show.image){
            let img = document.createElement("img")
            img.className = 'img'
            img.src = result.show.image.medium
            let cont = document.createElement('div')
            cont.className = 'cont'
            cont.append(img)
            grid.append(cont)
            let score = result.score
            let score1 = Math.floor(score*100)
            let rating = document.createElement('div')
            rating.className = 'rating'
            rating.innerText = `Rating: ${score1}%` 
            cont.append(rating)
            let type = document.createElement('div')
            type.className = 'type'
            type.innerText = `Type: ${result.show.type}`
            cont.append(type)
            // savedata()
            
            if(result.show.officialSite){
                let site = result.show.officialSite 
                let nav = document.createElement('a')
                nav.className = 'site'
                nav.innerText = 'Visit site'
                nav.href = site
                cont.append(nav)
                // savedata()
            }else if(result.show.officialSite === '' || result.show.officialSite === null || result.show.officialSite === undefined){
                cont.append('~ URL not found ~')
                // savedata()
            }
        }
    }
    savedata()
}

// Function for storing search results on users' device 
function savedata(){
    localStorage.setItem('data', grid.innerHTML)
}

// Function for retrieving and displaying search results upon page reload
function showdata(){
    grid.innerHTML = localStorage.getItem('data')
}
showdata()

// If conditional for displaying 'clear results' button
if(grid.innerHTML){
    clear.style.display = 'block'
}
