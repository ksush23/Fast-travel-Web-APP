var buttonAirport = document.querySelector('#buttonAirport');
var selectOption = document.querySelector('#airportList');
var inputValueAirport = document.querySelector('#inputAirport');
var buttonAddAirport = document.querySelector('#buttonAddAirport');
var inputWeather = document.querySelector('#inputWeather');
var outputCityWeather = document.querySelector('#outputCityWeather');
var buttonWeather = document.querySelector('#buttonWeather');
var buttonWeatherAdd = document.querySelector('#buttonWeatherAdd');
var buttonResults = document.querySelector('#buttonResults');
var clothesList = document.querySelector('#resultsClothesList');
var toDoList = document.querySelector('#resultsToDoList');
var progress = document.querySelector('#progress');
var departureAirports = document.querySelector('#departureAirportList');
var arrivalCities = document.querySelector('#arrivalCityList');
var airport;
var weather;
var arrivalCity;
document.querySelector('#container2').style.visibility = 'hidden';
document.querySelector('#container3').style.visibility = 'hidden';
document.querySelector('#container4').style.visibility = 'hidden';

hot = ["Light T-shirt", "Shorts", "Sandals", "Hat", "Sunglasses"];
female_hot = ["Light dress", "Skirt"];
warm = ["T-shirt", "Sandals or light sneakers", "Light jeans or trousers", "Lights socks"];
female_warm = ["Dress", "Skirt", "Ballet shoes"];
norm = ["T-shirt and warm jacket or light sweater", "Jeans or trousers", "Sneakers", "Socks"];
chilly = ["Sweater", "Warm jacket", "Jeans or trousers", "Warm sneakers or boots", "Socks"];
cold = ["Sweater", "Warm jeans or trousers", "Coat", "Boots", "Warm cap", "Gloves", "Scarf", "Warm socks or tights"];
superCold = ["Warm sweater", "Warm jeans or trousers", "Thermal underwear", "Warm socks", "Warm winter coat", "Winter boots",
    "Scarf", "Gloves", "Warm cap"
];
regular = ["Pajamas", "Underwear"];
todo = ["Take passport", "Take money", "Check visa and insurance", "Book accommodations", "Shower", "Pack and check luggage's weight"];
todoCold = ["Apply cold-protection cream"];


function addLists() {
    for (i = 0; i < localStorage.length; i++) {
        var entry = document.createElement('li');
        if (i % 2 == 0) {
            entry.appendChild(document.createTextNode(localStorage.getItem("departure" + i)));
            entry.className = "list-group-item list-group-item-warning";
            departureAirports.appendChild(entry);
        } else {
            entry.appendChild(document.createTextNode(localStorage.getItem("arrival" + i)));
            entry.className = "list-group-item list-group-item-warning";
            arrivalCities.appendChild(entry);
        }
    }
}

buttonAirport.onclick = function(event) {

    if (inputValueAirport.value == "") {
        alert("Please enter a departure city");
    } else {

        fetch("https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-text?text=" + inputValueAirport.value, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "cometari-airportsfinder-v1.p.rapidapi.com",
                    "x-rapidapi-key": "e4033f6c2fmshf63e95a9f12ff77p139bcajsn4f65e826971c"
                }
            })
            .then(function(response) {
                return response.json();
            }).then(function(jsonResponse) {
                removeOptions(selectOption);
                for (i = 0; i < jsonResponse.length; i++) {
                    var text = jsonResponse[i].code + ", " + jsonResponse[i].name;
                    selectOption.options[i] = new Option(text, jsonResponse[i].code);
                }
                if (jsonResponse.length == 0) {
                    alert("Invalid input, please try again");
                } else {
                    progress.style.width = "20%";
                }
            });
    }
}

buttonAddAirport.onclick = function(event) {
    airport = selectOption.value;
    if (airport == "") {
        alert("You should choose an airport");
    } else {
        document.querySelector('#container1').style.visibility = 'hidden';
        document.querySelector('#container2').style.visibility = 'visible';

        progress.style.width = "40%";

        var paragraph = document.querySelector('#departure');
        var e = document.querySelector('#airportList');
        var strUser = e.options[e.selectedIndex].text;
        var text = document.createTextNode(strUser);
        paragraph.appendChild(text);
    }
}

buttonWeather.onclick = function(event) {
    if (inputWeather.value == "") {
        alert("Please enter arrival city");
    } else {

        const url = 'http://api.weatherstack.com/current?access_key=7860098533d35229ea611e14fd6e5d5e&query=' + inputWeather.value;

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                weather = jsonResponse;
                outputCityWeather.value = jsonResponse.location.name + ", " + jsonResponse.location.country;
                progress.style.width = "60%";
            }).catch(error => {
                progress.style.width = "40%";
                alert("Invalid input, please try again");
            });
    }
}

buttonWeatherAdd.onclick = function(event) {
    if (inputWeather.value == "") {
        alert("Please enter the city");
    } else {
        document.querySelector('#container2').style.visibility = 'hidden';
        document.querySelector('#container3').style.visibility = 'visible';
        progress.style.width = "80%";
        var paragraph = document.querySelector('#arrival');
        var text = document.createTextNode(weather.location.name + ", " + weather.location.country);
        paragraph.appendChild(text);
    }
}

buttonResults.onclick = function(event) {
    if (!document.querySelector('#female').checked && !document.querySelector('#male').checked) {
        alert("Please choose your gender");
    } else {
        var gender;
        if (document.querySelector('#female').checked) {
            gender = 'female';

        } else {
            gender = 'male';
        }

        document.querySelector('#container3').style.visibility = 'hidden';
        document.querySelector('#container4').style.visibility = 'visible';

        var temperature = weather.current.temperature;
        var desc = weather.current.weather_descriptions[0];
        var clothes = [];

        if (temperature >= 25) {
            clothes = clothes.concat(hot);
            if (document.querySelector('#female').checked) {
                clothes = clothes.concat(female_hot);
            }
        } else if (temperature >= 20) {
            clothes = clothes.concat(warm);
            if (document.querySelector('#female').checked) {
                clothes = clothes.concat(female_warm);
            }
        } else if (temperature >= 15) {
            clothes = clothes.concat(norm);
        } else if (temperature >= 2) {
            clothes = clothes.concat(chilly);
        } else if (temperature >= -5) {
            clothes = clothes.concat(cold);
        } else {
            clothes = clothes.concat(superCold);
        }

        clothes = clothes.concat(regular);

        if (desc.includes("hower") || desc.includes("ain") || desc.includes("vercast") || desc.includes("loud")) {
            var arr = ["Umbrella or raincoat"];
            clothes = clothes.concat(arr);
        }

        for (i = 0; i < clothes.length; i++) {
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(clothes[i]));
            entry.className = "list-group-item list-group-item-dark";
            clothesList.appendChild(entry);
        }

        if (temperature < 0) {
            todo = todo.concat(todoCold);
        }

        if (weather.current.uv_index >= 3.6) {
            var arr = ["Apply sunscreen"];
            todo = todo.concat(arr);
        }

        for (i = 0; i < todo.length; i++) {
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(todo[i]));
            entry.className = "list-group-item list-group-item-dark";
            toDoList.appendChild(entry);
        }

        progress.style.width = "100%";
        localStorage.setItem("departure" + localStorage.length, document.querySelector('#departure').textContent);
        localStorage.setItem("arrival" + localStorage.length, document.querySelector('#arrival').textContent);
    }
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
    progress.style.width = "0%";
}