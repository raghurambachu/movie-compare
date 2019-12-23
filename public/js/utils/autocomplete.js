const createAutoComplete =  ({root,fetchData,displayList,fetchDetails})=>{

        root.innerHTML = `
        <div class="dropdown">
                        <div class="control">
                                <label class="label">Search Movie</label>       
                                <input class="input" type="text" placeholder="search movie">
                        </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content results">
                                
                        </div>
                </div>
        </div>
        `

        const inputDOM = root.querySelector("input");
        const resultsDOM = root.querySelector(".results");
        const dropdownDOM = root.querySelector('.dropdown')


        const listOfItems = (items)=>{
                inputDOM.setAttribute("placeholder","search movie")
                dropdownDOM.classList.add("is-active")
                resultsDOM.innerHTML =""
                if(!items.length){
                        dropdownDOM.classList.remove("is-active");
                        inputDOM.setAttribute("placeholder","not found.")
                }else{
                        for(let item of items){
                                displayList(item,resultsDOM)
                        }
                        const options = resultsDOM.querySelectorAll("a div")
                        options.forEach(option => {
                                option.addEventListener("click",()=>{
                                        dropdownDOM.classList.remove("is-active");
                                        inputDOM.value = option.innerText;
                                        fetchDetails(option)
                                        
                                })
                        });

                }
               
               
        }

        fetchData(inputDOM,listOfItems);

       

       
        
       


        
}