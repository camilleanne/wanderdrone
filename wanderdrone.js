function wanderdrone_init(debug){
	L.mapbox.accessToken = 'YOUR_ACCESS_TOKEN';
	var map = L.mapbox.map('map', 'camilleanne.l2if0e7g')
    
	L.map.minZoom = 5;
	L.map.mazZoom = 14;

	var lat = random_latitude();
	var lon = random_longitude();
	var zoom = random_int(4, 7);

	if (debug){
		lat = 37.75;
		lon = -122.45;
		zoom = 11;
	}

	map.setView([lat, lon], zoom);

	var max_lat;
	var min_lat;

	var t = null;

	var timeout_set_direction = null;
	var timeout_move = null;

	var move = function(x, y){

		if (timeout_move){
			clearTimeout(timeout_move);
		}

		timeout_move = setTimeout(function(){

			map.panBy([x * -2, y * -2]);

			var center = map.getCenter();
			var zoom = map.getZoom();

			if (center.lng > 180){
				center.lng = -180;
				map.setView(center);
			}

			if (center.lng < -180){
				center.lng = 180;
				map.setView(center);
			}

			if ((center.lat >= max_lat) || (center.lat <= min_lat)){
				set_direction();
				return;
			}

			var coords = document.getElementById("coords");

			var html = center.lat + "<br />" + center.lng;
			//html += "<br />@ zoom " + zoom;

			coords.innerHTML = html;

			move(x, y);	
		}, 50);
	};

	var set_direction = function(){

		if (timeout_set_direction){
			clearTimeout(timeout_set_direction);
		}

		var x = Math.random(0, 1);
		var y = Math.random(0, 1);

		x = (x < .5) ? 0 : 1;
		y = (y < .5) ? 0 : 1;

		if (x == 0 && y == 0){
			/* this is evil syntax... */
			(random_boolean()) ? x = 1 : y = 1;
		}

		x = (random_boolean()) ? x : -x;
		y = (random_boolean()) ? -y : y;

		var center = map.getCenter();

		max_lat = random_int(75, 82);
		min_lat = random_int(-75, -82);

		if (center.lat >= (max_lat - 15)){
			y = -1;
		}

		else if (center.lat <= (min_lat + 15)){
			y = 1;
		}

		var deg = wanderdrone_get_degrees(x, y);
		wanderdrone_rotate_drone(deg);

		var delay = parseInt(Math.random() * 60000);
		delay = Math.max(15000, delay);

		var zoom_by = Math.random() * 2;
		zoom_by = parseInt(zoom_by);

		if (random_boolean()) map.zoomIn(zoom_by);
		else map.zoomOut(zoom_by);

		timeout_set_direction = setTimeout(set_direction, delay);

		move(x, y);
	};

	set_direction();
}

function wanderdrone_get_degrees(x, y){

	var deg = 0;

	if ((x == 0) && (y == 1)){
		deg = 0;
	}

	else if ((x == -1) && (y == 1)){
		deg = 45;
	}

	else if ((x == -1) && (y == 0)){
		deg = 90;
	}

	else if ((x == -1) && (y == -1)){
		deg = 135;
	}

	else if ((x == 0) && (y == -1)){
		deg = 180;
	}

	else if ((x == 1) && (y == -1)){
		deg = 225;
	}

	else if ((x == 1) && (y == 0)){
		deg = 270;
	}

	else if ((x == 1) && (y == 1)){
		deg = 325;
	}

	else {}

	var dt = new Date();
	var ts = dt.getTime();

	var offset = parseInt(Math.random() * 10);
	offset = (ts % 2) ? offset : - offset;

	return deg + offset;
};

function wanderdrone_rotate_drone(deg){

	var rotate = "rotate(" + (deg) + "deg);";

	var tr = new Array(
		"transform:" + rotate,
		"-moz-transform:" + rotate,
		"-webkit-transform:" + rotate,
		"-ms-transform:" + rotate,
		"-o-transform:" + rotate
	);

	var drone = document.getElementById("drone");
	drone.setAttribute("style", tr.join(";"));
}

function wanderdrone_about(show){

	var about = document.getElementById("about");
	about.style.display = (show) ? "block" : "none";

	return false;
}

/* random */

function random_int(min, max){

	var r = parseInt(Math.random() * max);
	return Math.max(min, r);
}


function random_latitude(){
	return random_coordinate(90);
}	

function random_longitude(){
	return random_coordinate(180);
}	

function random_coordinate(max){
	return (Math.random() - 0.5) * max;
}

function random_boolean(){
	var dt = new Date();
	return (dt.getTime() % 2) ? 1 : 0;
}