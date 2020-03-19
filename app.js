$(document).ready(() => {
	const apiKey = "3dffcc381c8dd365908c495d0aa7445d";
	let position = {};

	const loadWeatherInformation = (data, imperial = false) => {
		$('#icon').attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
		$('#temp').text(`${Math.floor(data.main.temp)}`);
		$('#description').text(`${data.weather[0].description}`);
		$('#location').text(`${data.name}, ${data.sys.country} (${data.coord.lon}, ${data.coord.lat})`);

		imperial === true ? $('#unit').text("F") : $('#unit').text("C");
	};

	let unit = Cookies.get("unit");
	if (unit === undefined || unit !== "metric" || unit !== "imperial") Cookies.set("unit", "metric", { expires: 28 });

	navigator.geolocation.getCurrentPosition((pos) => {
		position.latitude = pos.coords.latitude;
		position.longitude = pos.coords.longitude;

		console.log("Able to proceed, coordinates were retrieved!");

		$.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=${unit}`, function(data) {
			loadWeatherInformation(data);
			
			$("#clickable").on("click", function (e) {
				e.preventDefault();

				if (unit === "metric") {
					Cookies.set("unit", "imperial", { expires: 28 });
					unit = "imperial";
					$.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=imperial`, function(data) {
						loadWeatherInformation(data, true);
					});
				} else {
					Cookies.set("unit", "metric", { expires: 28 });
					unit = "metric";
					$.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiKey}&units=metric`, function(data) {
						loadWeatherInformation(data);
					});
				}
			});
		});
	}, 
	() => {
		console.log("Unable to proceed, coordinates were not able to be retrieved!");
	});
});
