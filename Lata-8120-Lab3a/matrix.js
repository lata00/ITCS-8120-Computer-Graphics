

function identity() {
	return mat4(
		vec4(1., 0., 0., 0.),
		vec4(0., 1., 0., 0.),
		vec4(0., 0., 1., 0.),
		vec4(0., 0., 0., 1.)
	);
}

function translate(x,y){
	return mat4(
		vec4(1., 0., 0., x),
		vec4(0., 1., 0., y),
		vec4(0., 0., 1., 0.),
		vec4(0., 0., 0., 1.)
	)
}

function rotate(theta){
	return mat4(
		vec4(Math.cos(theta), -Math.sin(theta), 0., 0.),
		vec4(Math.sin(theta), Math.cos(theta), 0., 0.),
		vec4(0., 0., 1., 0.),
		vec4(0., 0., 0., 1.)
	)
}

function scale(x) {
	return mat4(
		vec4(x, 0., 0., 0.),
		vec4(0., x, 0., 0.),
		vec4(0., 0., x, 0.),
		vec4(0., 0., 0., 1.)
	);
}