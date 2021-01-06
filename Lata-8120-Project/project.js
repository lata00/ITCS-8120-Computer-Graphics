
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
var spokes = 12;
var phi = 0;
var phidir = 1;

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
	gl.clearColor(.25,.25,.25,1);
	
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
	//buildWheel(spokes,.75);

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
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
	};
	document.getElementById("yangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
	};
	document.getElementById("zangle").onchange = function(event){
		xangle = document.getElementById("xangle").value;
		yangle = document.getElementById("yangle").value;
		zangle = document.getElementById("zangle").value;
	};
};

function buildWheel(n,r,zangle,phi) {
	vertices = [];
	indices = [];
	vertexColors = [];
	vertices.push([0,0,0]);
	vertexColors.push([1,1,0,1]);
	dT = Math.PI*2/n;
	var cos = Math.cos(zangle*Math.PI/180);
	var sin = Math.sin(zangle*Math.PI/180);
	i=0;
	for (T = 0; T < Math.PI*2; T+=dT) {
		x = r*Math.cos(T);
		y = r*Math.sin(T);
		vertices.push([x*cos - y*sin,x*sin + y*cos,0]);
		vertexColors.push([1,0,0,1]);
		i+=1;
		indices.push(0,i);

		if(i<n){
			indices.push(i,i+1);
		}

		if(i==n){
			indices.push(1,i);
		}
	  }	
	  for (T = 0; T < Math.PI*2; T+=dT) {
		x = r*Math.cos(T);
		y = r*Math.sin(T);
		xx = x*cos - y*sin
		yy = x*sin + y*cos

		buildChair(.25*r,xx,yy,phi);
	  }	
}

function buildChair(a,x,y,phi) {
	var n = vertices.length;
	c = Math.cos(phi);
	s = Math.sin(phi);
	vertices.push([c*a*.25+x,s*a*.25+y,a*.25]); 		//0
	vertices.push([c*-a*.25+x,s*-a*.25+y,a*.25]); 		//1
	vertices.push([c*-a*.25+x,s*-a*.25+y,-a*.25]);		//2
	vertices.push([c*a*.25+x,s*a*.25+y,-a*.25]); 		//3
	vertices.push([(c*a*0.25-s*a*.5)+x,(s*a*0.25+c*a*.5)+y,a*.25]);		//4
	vertices.push([(c*a*0.25-s*a*.5)+x,(s*a*0.25+c*a*.5)+y,-a*.25]);		//5
	vertices.push([-(c*a*0.25-s*a*.5)+x,-(s*a*0.25+c*a*.5)+y,a*.25]);		//4
	vertices.push([-(c*a*0.25-s*a*.5)+x,-(s*a*0.25+c*a*.5)+y,-a*.25]);

	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);
	vertexColors.push([0,1,0.25,1]);

	indices.push(0+n,1+n);
	indices.push(1+n,2+n);
	indices.push(2+n,3+n);
	indices.push(3+n,0+n);
	indices.push(3+n,5+n);
	indices.push(5+n,4+n);
	indices.push(4+n,0+n);
	indices.push(1+n,6+n);
	indices.push(6+n,7+n);
	indices.push(7+n,2+n);
}

function roll(){
	spin = 0;
	xangle = 0;
	yangle = 0;
	zangle = 0;
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
	buildWheel(spokes,.75,zangle,phi);
	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	updateVertices();
	
	if (spin==1){
		xangle += 0;
		yangle += 0;
		zangle += .5;
		updateAngleDisplay();
	};

	numVertices = vertices.length;
	numIndices = indices.length;

	M = identity();
	gl.uniformMatrix4fv(M_Loc, false, flatten(M));
	gl.drawArrays(gl.POINTS, 0 , 1);
	gl.drawElements(gl.LINES, numIndices, gl.UNSIGNED_BYTE, 0);

	switch (phidir) {
		case 1:
			phi += .005;
			break;
		case 0:
			phi -= .005;
			break;
	}


	if (phi > .2) {
		phidir = 0;
	}
	if (phi < -.3){
		phidir = 1;
	}

    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}
