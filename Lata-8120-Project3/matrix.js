

function identity() {
	return mat4(
		vec4(1., 0., 0., 0.),
		vec4(0., 1., 0., 0.),
		vec4(0., 0., 1., 0.),
		vec4(0., 0., 0., 1.)
	);
}

function translate(x,y,z){
	return mat4(
		vec4(1., 0., 0., x),
		vec4(0., 1., 0., y),
		vec4(0., 0., 1., z),
		vec4(0., 0., 0., 1.)
	)
}

function rotate(thetax, thetay, thetaz){
	var z = mat4(
		vec4(Math.cos(thetaz), -Math.sin(thetaz), 0., 0.),
		vec4(Math.sin(thetaz), Math.cos(thetaz), 0., 0.),
		vec4(0., 0., 1., 0.),
		vec4(0., 0., 0., 1.)
	)
	var y = mat4(
		vec4(Math.cos(thetay), 0, Math.sin(thetay), 0.),
		vec4(0, 1, 0., 0.),
		vec4(-Math.sin(thetay), 0., Math.cos(thetay), 0.),
		vec4(0., 0., 0., 1.)
	)
	var x = mat4(
		vec4(1, 0, 0., 0.),
		vec4(0, Math.cos(thetax), -Math.sin(thetax), 0.),
		vec4(0., Math.sin(thetax), Math.cos(thetax), 0.),
		vec4(0., 0., 0., 1.)
	)
	return mult(z,mult(y,x));
}

function scale(x) {
	return mat4(
		vec4(x, 0., 0., 0.),
		vec4(0., x, 0., 0.),
		vec4(0., 0., x, 0.),
		vec4(0., 0., 0., 1.)	);
}

function scalex(x) {
	return mat4(
		vec4(x, 0., 0., 0.),
		vec4(0., 1, 0., 0.),
		vec4(0., 0., 1, 0.),
		vec4(0., 0., 0., 1.)	);
}