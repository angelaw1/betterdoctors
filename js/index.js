// This code depends on jQuery Core and Handlebars.js 

var api_key = 'd6effbdfbb46669a18c1d386f89c8c4a'; // Get your API key at developer.betterdoctor.com
const proxyurl = "https://cors-anywhere.herokuapp.com/";


/* specialities drop down menu */
var resource_url = 'https://api.betterdoctor.com/2016-03-01/specialties?skip=0&limit=20&user_key=' + api_key;

var data1 = $.get(resource_url);
$.when(data1).done(function(data1) {
  var template = Handlebars.compile(document.getElementById('specialties-template').innerHTML);
  document.getElementById('specialties-placeholder').innerHTML = template(data1);

  search();
});

function search() {
	var url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&limit=100';
	var specialty_uid = document.getElementById("specialty").value;
	if (specialty_uid == "empty") {
		url = url + '&user_key=' + api_key;
	}
	else {
		url = url + '&specialty_uid=' + specialty_uid + '&user_key=' + api_key;
	}

	var data = $.get(url);
	$.when(data).done(function(data) {
		console.log(data);
		var template = Handlebars.compile(document.getElementById('docs-template').innerHTML);
		document.getElementById('content-placeholder').innerHTML = template(data);
		var doctor = document.getElementsByClassName('myBtn');
		load_modal();
	});
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