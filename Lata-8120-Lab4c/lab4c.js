
// some globals
var gl;
var canvas;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc, Mp_Loc;
var delay = 16;
var vBuffer, cBuffer, vColor, iBuffer;
var program;
var color_vals = [];
var i = 0;
var vertexColors = [];
var vertices = [];
var indices = [];
var numVertices;
var M_model;
var M_camera;
var M_persp;
var M_ortho;
var xangle;
var yangle;
var zangle;
var spin = 0;
var vx;
var vy;
var vz;
var r = 1;
var theta = -90;
var phi = 0;
var psiz = 0;
var psiy = 0;
var eye;
var at = vec3(0,0,0);
var up;
var cyspin = 1;
var czspin = 0;
var camRotz;
var camRoty;
var zm;
var fov;

window.onload = function init() {
	// get the canvas handle from the document's DOM
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}

	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	colorLoc = gl.getUniformLocation(program, "vertColor");
	Mm_Loc = gl.getUniformLocation( program, "M_model" );
	Mc_Loc = gl.getUniformLocation( program, "M_camera" );
	Mp_Loc = gl.getUniformLocation( program, "M_persp" );
	Mo_Loc = gl.getUniformLocation( program, "M_ortho" );


    vBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();
	iBuffer = gl.createBuffer();
	setEventHandlers();
	initVertices();
	subVertices(0,.51,0,.25)

	xangle = 0*Math.round(Math.random()*4)*90;
	yangle = 0*Math.round(Math.random()*4)*90;
	zangle = 0*Math.round(Math.random()*4)*90;

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.SCISSOR_TEST);
	gl.enable(gl.CULL_FACE);

	document.getElementById("zoom").step = .01;
	document.getElementById("fov").step = .01;
	document.getElementById("theta").step = .01;


    render();
};

function setEventHandlers() {

	document.getElementById("roll").onclick = function(event) {
		roll();
	};

	document.getElementById("spin").onclick = function(event) {
		setSpin(spin);
	};

	document.getElementById("cyspin").onclick = function(event) {
		setySpin(cyspin);
	};

	document.getElementById("czspin").onclick = function(event) {
		setzSpin(czspin);
	};

	document.getElementById("reset").onclick = function(event) {
		spin = 0;
		vx;
		vy;
		vz;
		r = 1;
		theta = -45;
		phi = 0;
		psiz = 0;
		psiy = 0;
		eye;
		at = vec3(0,0,0);
		up;
		cyspin = 0;
		czspin = 0;
		xangle = 0*Math.round(Math.random()*4)*90;
		yangle = 0*Math.round(Math.random()*4)*90;
		zangle = 0*Math.round(Math.random()*4)*90;
		updateAngleDisplay();
	};
	document.getElementById("xangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
		phi   = document.getElementById("cyangle").value;
		psiz  = document.getElementById("czangle").value;
	};
	document.getElementById("yangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
		phi   = document.getElementById("cyangle").value;
		psiz  = document.getElementById("czangle").value;
	};
	document.getElementById("zangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
		phi   = document.getElementById("cyangle").value;
		psiz  = document.getElementById("czangle").value;
	};
	document.getElementById("cyangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
		phi   = document.getElementById("cyangle").value;
		psiz  = document.getElementById("czangle").value;
	};
	document.getElementById("czangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
		phi   = document.getElementById("cyangle").value;
		psiz  = document.getElementById("czangle").value;
	};

	document.getElementById("zoom").onchange = function(event){
		zm = document.getElementById("zoom").value;
	}
};
function initVertices(){
	vertices = 
	[
		vec3(-.5,-.75,.5), 	//0
		vec3(-.5,.25,.5),  	//1
		vec3(.5,.25,.5),   	//2
		vec3(.5,-.75,.5),  	//3
		vec3(-.5,-.75,-.5),	//4
		vec3(-.5,.25,-.5), 	//5
		vec3(.5,.25,-.5),  	//6
		vec3(.5,-.75,-.5)	//7
							];

	indices = 
	[
		1, 0, 3,
		3, 2, 1,
		2, 3, 7,
		7, 6, 2,
		3, 0, 4,
		4, 7, 3,
		6, 5, 1,
		1, 2, 6,
		4, 5, 6,
		6, 7, 4,
		5, 4, 0,
		0, 1, 5
					];

	numVertices = indices.length;

	vertexColors = 
	[
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1], // Blue
		[0,0,1,1] // Blue
									]
}

function subVertices(x,y,z,size){

	var n = vertices.length;

	vertices.push(
		vec3(size+x,-size+y,size+z),
		vec3(size+x,size+y,size+z),
		vec3(-size+x,size+y,size+z),
		vec3(-size+x,-size+y,size+z),
		vec3(size+x,-size+y,-size+z),
		vec3(size+x,size+y,-size+z),
		vec3(-size+x,size+y,-size+z),
		vec3(-size+x,-size+y,-size+z)
	);

	indices.push(
		1+n, 0+n, 3+n,
		3+n, 2+n, 1+n,
		2+n, 3+n, 7+n,
		7+n, 6+n, 2+n,
		3+n, 0+n, 4+n,
		4+n, 7+n, 3+n,
		6+n, 5+n, 1+n,
		1+n, 2+n, 6+n,
		4+n, 5+n, 6+n,
		6+n, 7+n, 4+n,
		5+n, 4+n, 0+n,
		0+n, 1+n, 5+n
	);

	vertexColors.push(
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1], 
		[1,0,0,1] 

					);
}

function roll(){
	spin = 0;
	xangle = Math.round(Math.random()*4)*90;
	yangle = Math.round(Math.random()*4)*90;
	zangle = Math.round(Math.random()*4)*90;
	updateAngleDisplay();
}

function setSpin(s) {
	if (s==0){
		spin = 1;
	}

	if (s==1){
		spin = 0;
	}
	
	vx = Math.random();
	vy = Math.random();
	vz = Math.random();
}

function setySpin(s) {
	if (s==0){
		cyspin = 1;
	}

	if (s==1){
		cyspin = 0;
	}
}

function setzSpin(s) {
	if (s==0){
		czspin = 1;
	}

	if (s==1){
		czspin = 0;
	}
}

function updateAngleDisplay() {
	document.getElementById("xangle").value = Math.round(xangle%360);
	document.getElementById("yangle").value = Math.round(yangle%360);
	document.getElementById("zangle").value = Math.round(zangle%360);
	document.getElementById("cyangle").value = Math.round(phi%360);
	document.getElementById("czangle").value = Math.round(psiz%360);
}

function updateVertices() {

	// make the needed GL calls to tranfer vertices

	// bind the buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// transfer the data -- this is actually pretty inefficient!
	// flatten() function is defined in MV.js - this simply creates only
	// the vertex coordinate data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	// Associate out shader variables with our data buffer
	// note: "vposition" is a named variable used in the vertex shader and is
	// associated with vPosition here
	var vPosition = gl.getAttribLocation( program, "vPosition");

	// specify the format of the vertex data - here it is a float with
	// 2 coordinates per vertex - these are its attributes
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

	// enable the vertex attribute array 
	gl.enableVertexAttribArray(vPosition);

	// we will use a single color for all primitives and so we will directly set
	// the color in the GPU's fragment shader. If you do need to set individual
	// colors for each vertex, then you will need to send a color buffer, 
	// similar to the vertex buffer, with associated shader variables for color.
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
	vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	//bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
	}

function render() {
    // set up a viewing surface to display your image
	gl.viewport(0, 0, canvas.width/2, canvas.height);
	gl.scissor(0, 0, canvas.width/2, canvas.height);
	gl.clearColor(1, 1, 0, 1);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
	// each
	updateVertices();

	//update variables
	if (spin==1){
		xangle += vx;
		yangle += vy;
		zangle += vz;
	};
	if (cyspin==1){
		phi += 1;
		updateAngleDisplay();
	}
	if (czspin==1){
		psiz += 1;
		updateAngleDisplay();
	}
	theta = document.getElementById("theta").value*1;
	phir = phi*Math.PI/180;
	psizr = psiz*Math.PI/180;
	thetar = theta*Math.PI/180;

	//Left Viewport
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(0),
				 r*Math.cos(thetar),
				 r*Math.sin(thetar)*Math.sin(0));
	eyehat = normalize(eye);
	up = 	vec3(Math.cos(thetar)*Math.cos(0),
				-Math.sin(thetar),
				 Math.cos(thetar)*Math.sin(0));
	camRotz = rotate(0,0,psizr);
	M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera = mult(camRotz,lookAt(eye,at,up));
	fov = document.getElementById("fov").value*1;
	M_persp = perspective2(2,2,1,0,fov);
	zm = document.getElementById("zoom").value*1;
	M_ortho = ortho(-zm/fov,zm/fov,-zm/fov,zm/fov,-2,2);
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	numVertices = indices.length;
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);


	// Right Viewport
	gl.viewport(512, 0, canvas.width/2, canvas.height);
	gl.scissor(512, 0, canvas.width/2, canvas.height);
	gl.clearColor(.5, 1, 1, 1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
				 r*Math.cos(thetar),
				 r*Math.sin(thetar)*Math.sin(phir));
	eyehat = normalize(eye);
	up = 	vec3(Math.cos(thetar)*Math.cos(phir),
				-Math.sin(thetar),
				 Math.cos(thetar)*Math.sin(phir));
	camRotz = rotate(0,0,psizr);
	M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera = mult(camRotz,lookAt(eye,at,up));
	fov = document.getElementById("fov").value*1;
	M_persp = perspective2(2,2,1,0,fov);
	zm = document.getElementById("zoom").value*1;
	M_ortho = ortho(-zm/fov,zm/fov,-zm/fov,zm/fov,-2,2);
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	numVertices = indices.length;
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}

function drawScene(projectionMatrix, cameraMatrix) {

	M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera = cameraMatrix;
	M_persp = identity();
	M_persp = perspective(45,1,-100,1);
	M_ortho = ortho(-1,1,-1,1,-1,1);
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	gl.uniform4fv(colorLoc, flatten(vertexColors));
	numVertices = indices.length;
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);	
}