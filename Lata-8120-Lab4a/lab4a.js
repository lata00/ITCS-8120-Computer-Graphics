
// some globals
var gl;
var colorLoc, M_Loc, scaleLoc, transLoc;
var delay = 16;
var vBuffer, cBuffer, vColor, iBuffer;
var program;
var color_vals = [];
var i = 0;
var vertexColors = [];
var vertices = [];
var indices = [];
var numVertices;
var M;
var xangle;
var yangle;
var zangle;
var spin = 0;
var vx;
var vy;
var vz;


window.onload = function init() {
	// get the canvas handle from the document's DOM
	var canvas = document.getElementById( "gl-canvas" );
	
	// initialize webgl
	gl = WebGLUtils.setupWebGL( canvas );
	
	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}
    // set up a viewing surface to display your image
	gl.viewport(0, 0, canvas.width, canvas.height);
	
	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
	gl.clearColor(.66, 1, 1, 1);
	
    //  Load shaders -- all work done in init_shaders.js
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	// make this the current shader program
	gl.useProgram( program );
	
	// Get a handle to transform matrix  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable

	// we are also going manipulate the vertex color, so get its location
	colorLoc = gl.getUniformLocation(program, "vertColor");

	// transformation matrix location
	M_Loc = gl.getUniformLocation( program, "M" );

	// set an initial color for all vertices
	//gl.uniform4fv (colorLoc, [1., .5, 1., 1.])

	// create a vertex buffer - this will hold all vertices
    vBuffer = gl.createBuffer();

	// create a vertex buffer
	cBuffer = gl.createBuffer();

	// create an index buffer
	iBuffer = gl.createBuffer();

	// create event handlers
	setEventHandlers();

	//Build Cube
	initVertices();
	//First Face
	subVertices(0,0,-.451);
	//Second Face
	subVertices(-.2,-.2,.451);
	subVertices(.2,.2,.451);
	//Third Face
	subVertices(.451,.25,.25);
	subVertices(.451,-.25,-.25);
	subVertices(.451,0,0);
	//Fourth Face
	subVertices(-.451,.25,.25);
	subVertices(-.451,-.25,-.25);
	subVertices(-.451,.25,-.25);
	subVertices(-.451,-.25,.25);
	//Fifth Face
	subVertices(.25,-.451,.25);
	subVertices(-.25,-.451,-.25);
	subVertices(.25,-.451,-.25);
	subVertices(-.25,-.451,.25);
	subVertices(0,-.451,0);
	//Sixth Face
	subVertices(.25,.451,.25);
	subVertices(-.25,.451,-.25);
	subVertices(.25,.451,-.25);
	subVertices(-.25,.451,.25);
	subVertices(0,.451,.25);
	subVertices(0,.451,-.25);

	roll();

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    render();
};

function setEventHandlers() {

	document.getElementById("roll").onclick = function(event) {
		roll();
	};

	document.getElementById("spin").onclick = function(event) {
		setSpin(spin);
	};
	document.getElementById("xangle").onchange = function(event){
		xangle = document.getElementById("xangle").value*Math.PI/180;
		yangle = document.getElementById("yangle").value*Math.PI/180;
		zangle = document.getElementById("zangle").value*Math.PI/180;
	};
	document.getElementById("yangle").onchange = function(event){
		xangle = document.getElementById("xangle").value*Math.PI/180;
		yangle = document.getElementById("yangle").value*Math.PI/180;
		zangle = document.getElementById("zangle").value*Math.PI/180;
	};
	document.getElementById("zangle").onchange = function(event){
		xangle = document.getElementById("xangle").value*Math.PI/180;
		yangle = document.getElementById("yangle").value*Math.PI/180;
		zangle = document.getElementById("zangle").value*Math.PI/180;
	};
};
function initVertices(){
	vertices = 
	[
		vec3(-.5,-.5,.5), 	//0
		vec3(-.5,.5,.5),  	//1
		vec3(.5,.5,.5),   	//2
		vec3(.5,-.5,.5),  	//3
		vec3(-.5,-.5,-.5),	//4
		vec3(-.5,.5,-.5), 	//5
		vec3(.5,.5,-.5),  	//6
		vec3(.5,-.5,-.5)	//7
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
		[0,0,1,.9], // Blue
		[0,1,0,.9], // Green
		[1,0,0,.9], // Red
		[1,1,0,.9], // Yellow
		[1,0,0,.9], // Red
		[1,1,0,.9], // white
		[0,0,1,.9], // Blue
		[0,1,0,.9], // Green
									]
}

function subVertices(x,y,z){

	var n = vertices.length;

	vertices.push(
		vec3(.05+x,-.05+y,.05+z),
		vec3(.05+x,.05+y,.05+z),
		vec3(-.05+x,.05+y,.05+z),
		vec3(-.05+x,-.05+y,.05+z),
		vec3(.05+x,-.05+y,-.05+z),
		vec3(.05+x,.05+y,-.05+z),
		vec3(-.05+x,.05+y,-.05+z),
		vec3(-.05+x,-.05+y,-.05+z)
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
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1],
		[0,0,0,1]
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

function updateAngleDisplay() {
	document.getElementById("xangle").value = Math.round(xangle%360);
	document.getElementById("yangle").value = Math.round(yangle%360);
	document.getElementById("zangle").value = Math.round(zangle%360);
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
	// this is render loop

	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
	// each
	updateVertices();
	if (spin==1){
		xangle += vx;
		yangle += vy;
		zangle += 0;
		updateAngleDisplay();
	};
	M = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	gl.uniformMatrix4fv(M_Loc, false, flatten(M));
	gl.uniform4fv(colorLoc, flatten(vertexColors))
	numVertices = indices.length;

	// draw the square as a triangle
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);	

    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}
