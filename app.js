$(document).ready(() => {
	const apiKey = "3dffcc381c8dd365908c495d0aa7445d";
	let position = {};

	const loadWeatherInformation = (data) => {
		$('#icon').attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
		$('#temp').text(`${Math.floor(data.main.temp)}`);
		$('#description').text(`${data.weather[0].description}`);
		$('#location').text(`${data.name}, ${data.sys.country} (${data.coord.lon}, ${data.coord.lat})`);
	};

	navigator.geolocation.getCurrentPosition((pos) => {
		position.latitude = pos.coords.latitude;
		position.longitude = pos.coords.longitude;

		console.log("Able to proceed, coordinates were retrieved!");

		$.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=metric`, function(data) {
			loadWeatherInformation(data);
			console.log(data);
		});
	}, 
	() => {
		console.log("Unable to proceed, coordinates were not able to be retrieved!");
	});
});
