/*
-- Levan Mebonia--

Project: Wikipedia viewer | (using wikipedia API)

 note : Wikipedia API (openseach) is no longer responding with the description
You have to make two request to the WikiApi :
  -- opensearch : for search value and website link
  -- query: for the description

 */

window.onload = function(){
///Some Variables
let items_container = document.getElementById("items_container");
let search_bar = document.getElementById("search_bar");
let search_button = document.getElementById("search_button");
search_bar.value = "";


// to store the objects
let objs = [];
// to store the elements
let elements = [];

//function to construct the url for the description request_description
function urlLoader_description(value){

  let url = "https://en.wikipedia.org/w/api.php";
  url = url + "?origin=*";

  let params = {
      action: "query",
      prop: "extracts",
      generator: "prefixsearch",
      gpslimit: 1,
      redirects: 1,
      converttitles: 1,
      formatversion: 2,
      exintro: 1,
      exsentences: 3,
      explaintext: 1,
      gpssearch: "",
      format: "json"
    };

    params.gpssearch = value;

    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    return url;

}

//function to construct the url for the request
function urlLoader(){

  //url
  let url = "https://en.wikipedia.org/w/api.php";
  url = url + "?origin=*";

  let params = {
      action: "opensearch",
      search: "",
      limit: 3,
      namespace: 0,
      format: "json"
    };
    if(search_bar.value != '') {
    params.search = search_bar.value;
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
  }
    return url;

}
//callback function 1 to extract data from request
function stage1(data){

  let data_titles = [];
  let data_links = [];

  for(let t = 0; t < data[1].length; t++) {
    data_titles.push(data[1][t]);
  }

  for(let l = 0; l < data[3].length; l++) {
    data_links.push(data[3][l]);
  }

  for(let i = 0; i < data_titles.length; i++) {
    objs.push({"title": data_titles[i], "link": data_links[i], "description": ""});
  }

  data_titles = [];
  data_links = [];

  element_maker();


}


//seperate request to get the description based on the value searching
function request_description(url, element){

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if( this.readyState == 4 && this.status == 200 ){
      let json = JSON.parse(this.responseText);
      element.innerHTML = json["query"]["pages"][0]["extract"];
    }
  }
  xhttp.open("GET",url,true);
  xhttp.send();

}

function request(url) {

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(this.responseText);
      stage1(json);
    }
  }
  xhttp.open("GET",url,true);
  xhttp.send();

}

//function to construct the elements

function element_maker(){

  for(let i = 0; i < objs.length; i++) {

    let div = document.createElement("div");
    div.classList.add("items");
    let a = document.createElement("a");
    a.classList.add("item_links");
    a.setAttribute("href", objs[i]["link"]);
    a.setAttribute("target", "_blank");
    let h3 = document.createElement("h3");
    h3.textContent = objs[i]["title"];
    let p = document.createElement("p");
    let url = urlLoader_description(objs[i]["title"]);
    request_description(url,p);
    a.appendChild(h3);
    div.appendChild(a);
    div.appendChild(p);
    elements.push(div);
  }
  objs = [];
  templateGenerator();

}

//cleaning the items_container
function container_cleaner(){
  items_container.innerHTML = "";
}


//generating elements to the DOM
function templateGenerator(){
  container_cleaner();
  for(let i = 0; i < elements.length; i++) {
    items_container.appendChild(elements[i]);
  }
  elements = [];
}




//main app function
function main(){
  let url = urlLoader();
  request(url);
}


//EventListeners for input and button
search_bar.addEventListener("keypress", (e)=>{
    if(e.key == "Enter") {
      let search_value = search_bar.value;
      if(search_value != '') {
        main();
        search_bar.value = "";
      }
    }
  });


search_button.addEventListener("click", ()=>{
  let search_value = search_bar.value;
  if(search_value != '') {
    main();
    search_bar.value = "";
  }
});


}
