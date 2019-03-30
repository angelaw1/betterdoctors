// This code depends on jQuery Core and Handlebars.js 

var api_key = 'd6effbdfbb46669a18c1d386f89c8c4a'; // Get your API key at developer.betterdoctor.com

/* specialities drop down menu */
var resource_url = 'https://api.betterdoctor.com/2016-03-01/specialties?skip=0&limit=20&user_key=' + api_key;
$.get(resource_url, function (data) {
  // data: { meta: {<metadata>}, data: {<array[Specialty]>} }
  var template = Handlebars.compile(document.getElementById('specialties-template').innerHTML);
  document.getElementById('specialties-placeholder').innerHTML = template(data);
});

/* example output */
var example_url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=' + api_key;

$.get(example_url, function (data) {
  // data: { meta: {<metadata>}, data: {<array[Practice]>} }
  var template = Handlebars.compile(document.getElementById('docs-template').innerHTML);
  document.getElementById('content-placeholder').innerHTML = template(data);
});