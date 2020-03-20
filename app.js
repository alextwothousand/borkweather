window.onload = () => {
	const apiKey = "3dffcc381c8dd365908c495d0aa7445d";
	let position = {};

	const loadWeatherInformation = (data, imperial = 0) => {
		document.getElementById('icon').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
		document.getElementById('temp').innerText = `${Math.floor(data.main.temp)}`;
		document.getElementById('description').innerText = `${data.weather[0].description}`;
		document.getElementById('location').innerText = `${data.name}, ${data.sys.country} (${data.coord.lon}, ${data.coord.lat})`;
		document.getElementById('unit').innerText = imperial === 1 ? "F" : "C";
	};

	let units = Cookies.get("unit");
	units = typeof units === "undefined" ? null : units = units.trim();
	if(typeof units === "undefined" || (units != "metric" && units !== "imperial") ) { units = "metric"; Cookies.set("unit", "metric", { expires: 28 }); }
	navigator.geolocation.getCurrentPosition((pos) => {
		position.latitude = pos.coords.latitude;
		position.longitude = pos.coords.longitude;

		console.log("Able to proceed, coordinates were retrieved!");
		makeRequest(`https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=${units}`).then(data => {
			let initialConvertion = units === "imperial" ? 1 : 0;
			loadWeatherInformation(data, initialConvertion);
			document.getElementById('clickable').addEventListener('click', (e) => {
				e.preventDefault();
				if (units === "metric") {
					Cookies.set("unit", "imperial", { expires: 28 });
					units = "imperial";
					data.main.temp = doConversion(data.main.temp, 1);
					loadWeatherInformation(data, 1);
				} else {
					Cookies.set("unit", "metric", { expires: 28 });
					units = "metric";
					data.main.temp = doConversion(data.main.temp, 0);
					loadWeatherInformation(data);
				}
			});
		});
	}, 
	() => {
		console.log("Unable to proceed, coordinates were not able to be retrieved!");
	});
};

function makeRequest(uri) {
	return new Promise((resolve, reject) => {
		fetch(uri).then(response => {
			return response.json();
		}).then(data => {
			resolve(data);
		}).catch(err => {
			reject(err);
		});
	});
}

function doConversion(obj, tempType) {
	return tempType == 0 ? ((obj - 32) * 5) / 9 : ((obj / 5) * 9) + 32;
}