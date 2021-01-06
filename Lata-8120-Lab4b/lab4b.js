
// some globals
var gl;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc;
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
var M_ortho;
var xangle;
var yangle;
var zangle;
var spin = 0;
var vx;
var vy;
var vz;
var r = 1;
var theta = -45;
var phi = 0;
var psiz = 0;
var psiy = 0;
var eye;
var at = vec3(0,0,0);
var up;
var cyspin = 0;
var czspin = 0;
var camRotz;
var camRoty;

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
	Mm_Loc = gl.getUniformLocation( program, "M_model" );
	Mc_Loc = gl.getUniformLocation( program, "M_camera" );
	Mo_Loc = gl.getUniformLocation( program, "M_ortho" );

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

	//Second Cube
	subVertices(0,0,-.75,.15)
	subVertices(0,0,.75,.15)
	subVertices(.75,0,0,.15)
	subVertices(-.75,0,0,.15)

	xangle = 0*Math.round(Math.random()*4)*90;
	yangle = 0*Math.round(Math.random()*4)*90;
	zangle = 0*Math.round(Math.random()*4)*90;

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
	};
	if (cyspin==1){
		phi += 1;
		updateAngleDisplay();
	}
	if (czspin==1){
		psiz += 1;
		updateAngleDisplay();
	}
	phir = phi*Math.PI/180;
	psizr = psiz*Math.PI/180;
	thetar = theta*Math.PI/180;
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
				 r*Math.cos(thetar),
				 r*Math.sin(thetar)*Math.sin(phir));
	eyehat = normalize(eye);
	up = 	vec3(Math.cos(thetar)*Math.cos(phir),
				-Math.sin(thetar),
				 Math.cos(thetar)*Math.sin(phir));
	camRotz = rotate(0,0,psizr);
	//camRoty = translate(eye[0],eye[1],eye[2]);
	//camRoty = mult(rotate(0,theta,phi),camRoty);
	//camRoty = mult(rotate(0,psiy,0),camRoty);
	//camRoty = mult(rotate(0,-theta,-phi),camRoty);
	//camRoty = mult(translate(-eye[0],-eye[1],-eye[2]),camRoty);
	M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera = mult(camRotz,lookAt(eye,at,up));
	//M_camera = mult(camRotz,M_camera);
	M_ortho = ortho(-1,1,-1,1,-2,2);
	//updateAngleDisplay();
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	gl.uniform4fv(colorLoc, flatten(vertexColors))
	numVertices = indices.length;

	// draw the square as a triangle
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);	

    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}
