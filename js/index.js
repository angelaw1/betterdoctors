// This code depends on jQuery Core and Handlebars.js 

var api_key = 'd6effbdfbb46669a18c1d386f89c8c4a'; // Get your API key at developer.betterdoctor.com
var google_api = 'AIzaSyDHPHFFGO3uVJMJnn7Jl0Su6L1VVPWRGZE';
const proxyurl = "https://cors-anywhere.herokuapp.com/";

var latitude = "37.773";
var longitude = "-122.413";

/* specialities drop down menu */
var resource_url = 'https://api.betterdoctor.com/2016-03-01/specialties?skip=0&limit=20&user_key=' + api_key;

var specialties_data = $.get(resource_url);
$.when(specialties_data).done(function(specialties_data) {
  var template = Handlebars.compile(document.getElementById('specialties-template').innerHTML);
  document.getElementById('specialties-placeholder').innerHTML = template(specialties_data);

  setTimeout(function() {
  	search(); }, 
  	500);
});

function request_location() {
  var startPos;

  var geoSuccess = function(position) {
    // We have the location, don't display banner
    // clearTimeout(nudgeTimeoutId);

    // Do magic with location
    startPos = position;
    latitude = startPos.coords.latitude;
    longitude = startPos.coords.longitude;

    var geocode_url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + google_api;

    make_geocode_request(geocode_url);

    function make_geocode_request(geocode_url) {
    	var geocode_data = $.get(geocode_url);
    	$.when(geocode_data).done(function(geocode_data) {
    		console.log(geocode_data);

    		address_comp = geocode_data.results[0].address_components;
    		for (i = 0; i < address_comp.length; i++) {
    			if (address_comp[i].types.includes("postal_code")) {
					var loc_element = document.getElementById("location");
					loc_element.value = address_comp[i].long_name;
    			}
    		}
    		
    	});
    }
  };

  var geoError = function(error) {
    switch(error.code) {
		case error.PERMISSION_DENIED:
			console.log("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			console.log("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			console.log("An unknown error occurred.");
			break;
	}
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

function search() {
	var search_url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=' + latitude + ',' + longitude + ',100&limit=100';
	var specialty_uid = document.getElementById("specialty").value;
	var zip = document.getElementById("location").innerHTML;

	console.log("specialty uid: " + specialty_uid);
	if (specialty_uid == "empty") {
		search_url = search_url + '&user_key=' + api_key;
	}
	else {
		search_url = search_url + '&specialty_uid=' + specialty_uid + '&user_key=' + api_key;
	}

	initiate_search(search_url, 500);
	

	function initiate_search(search_url, timeout) {
		console.log(`wait ${timeout} milliseconds`);
		$.ajax({
			type:	"get",
			url:	search_url,
			error: function() {
				console.log("fail");
				setTimeout(function() {
					initiate_search(search_url, timeout*2); },
					timeout);
			},
			success: function (data) {

				// var data = $.get(search_url);
				//$.when(data).done(function(data) {
					console.log(data);
					var template = Handlebars.compile(document.getElementById('docs-template').innerHTML);
					document.getElementById('content-placeholder').innerHTML = template(data);
					var doctor = document.getElementsByClassName('myBtn');
					load_modal();
				//});
			},
		});
	}

	
}

function load_modal() {
	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	var btns = document.getElementsByClassName("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	$('.myTable tr').click(function() {
		var val = $(this).data('value');
		modal.style.display = "block";
		var url = 'https://api.betterdoctor.com/2016-03-01/doctors/'+ val + '?user_key=' + api_key;

		var doctor = $.get(url);
		$.when(doctor).done(function(doctor) {
			console.log(doctor);
			var template = Handlebars.compile(document.getElementById('modal-doctor-template').innerHTML);
			document.getElementById('modal-content-placeholder').innerHTML = template(doctor);

			// get similar doctors
			get_similar_doctors(doctor.data);
		});
	});

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	};
}

function get_similar_doctors(doctor) {
	var location = doctor.practices[0].lat + ',' + doctor.practices[0].lon + ',100';
	var specialty = doctor.specialties[0].uid;
	var url = proxyurl + 'https://api.betterdoctor.com/2016-03-01/doctors?location=' + location + '&specialty_uid=' + specialty + '&sort=distance-asc&skip=2&user_key=' + api_key;
	
	var data = $.get(url);
	$.when(data).done(function(data) {
		console.log('got similar doctors');
		var template = Handlebars.compile(document.getElementById('modal-similar-template').innerHTML);
		document.getElementById('modal-similar-placeholder').innerHTML = template(data);
	});

}