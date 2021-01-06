
// some globals
var gl;
var canvas;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc, Mp_Loc;
var delay = 16;
var vBuffer1, vBuffer2, cBuffer1, cBuffer2, iBuffer1, iBuffer2, vColor, vPosition;
var program;
var i = 0;
var vertexColors1 = [];
var vertexColors2 = [];
var vertices1 = [];
var vertices2 = [];
var indices1 = [];
var indices2 = [];
var numVertices;
var M_model;
var M_camera;
var M_persp;
var M_persp1;
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
var cyspin = 0;
var czspin = 0;
var camRotz;
var camRoty;
var rightP;
var topP;
var nearP;
var farP;
var r2 = 1;
var theta2 = -90;
var phi2 = 0;
var rightP2;
var topP2;
var nearP2;
var farP2;


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
	vPosition = gl.getAttribLocation( program, "vPosition");
	vColor = gl.getAttribLocation(program, "vColor");

	vBuffer1 = gl.createBuffer();
	vBuffer2 = gl.createBuffer();
	cBuffer1 = gl.createBuffer();
	cBuffer2 = gl.createBuffer();
	iBuffer1 = gl.createBuffer();
	iBuffer2 = gl.createBuffer();

	setEventHandlers();

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

	document.getElementById("theta").step = .01;
	document.getElementById("phi").step = .01;
	document.getElementById("r").step = .01;
	document.getElementById("right").step = .01;
	document.getElementById("top").step = .01;
	document.getElementById("near").step = .01;
	document.getElementById("far").step = .01;

	document.getElementById("theta2").step = .01;
	document.getElementById("phi2").step = .01;
	document.getElementById("r2").step = .01;
	document.getElementById("right2").step = .01;
	document.getElementById("top2").step = .01;
	document.getElementById("near2").step = .01;
	document.getElementById("far2").step = .01;

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




function updateVertices1() {
	vertices1 = [];
	vertexColors1 = [];
	indices1 = [];

	colorCube();
	subVertices(0,.51,0,.25)

	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer1);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors1), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	//bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer1);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices1),gl.STATIC_DRAW);

	}

function updateVertices2() {
	var a = (farP)/(nearP);
	vertices2 = [];
	vertexColors2 = [];
	indices2 = [];

	n = vertices2.length;

	vertices2.push([-rightP,-topP,-r+nearP]);
	vertices2.push([-rightP,topP,-r+nearP]);
	vertices2.push([rightP,-topP,-r+nearP]);
	vertices2.push([rightP,topP,-r+nearP]);

	indices2.push(0+n,1+n,2+n,1+n,2+n,3+n,
				  1+n,0+n,2+n,2+n,1+n,3+n,);

	vertexColors2.push( [0,1,0,.75], 
						[0,1,0,.75], 
						[0,1,0,.75],
						[0,1,0,.75]);

	n = vertices2.length;

	vertices2.push([-rightP*a,-topP*a,-r+farP]);
	vertices2.push([-rightP*a,topP*a,-r+farP]);
	vertices2.push([rightP*a,-topP*a,-r+farP]);
	vertices2.push([rightP*a,topP*a,-r+farP]);

	indices2.push(0+n,1+n,2+n,1+n,2+n,3+n,
				  1+n,0+n,2+n,2+n,1+n,3+n,);

	vertexColors2.push( [1,1,0,.75], 
						[1,1,0,.75], 
						[1,1,0,.75],
						[1,1,0,.75]);

	vertices2.push([0,0,-r]);
	vertices2.push([-rightP*a,-topP*a,-r+farP]);
	vertices2.push([0,0,-r]);
	vertices2.push([-rightP*a,topP*a,-r+farP]);
	vertices2.push([0,0,-r]);
	vertices2.push([rightP*a,-topP*a,-r+farP]);
	vertices2.push([0,0,-r]);
	vertices2.push([rightP*a,topP*a,-r+farP]);

	vertexColors2.push( [1,0,0,1], 
						[1,0,0,1],
						[1,0,0,1], 
						[1,0,0,1], 
						[1,0,0,1], 
						[1,0,0,1], 
						[1,0,0,1], 
						[1,0,0,1])
	

	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer2);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors2), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	//bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer2);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices2),gl.STATIC_DRAW);
	}

function render() {

	updateVertices1();
	updateVariables();

	//Define Eye & Up
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
			r*Math.cos(thetar),
			r*Math.sin(thetar)*Math.sin(phir));

	up = 	vec3(Math.cos(thetar)*Math.cos(phir),
			-Math.sin(thetar),
			Math.cos(thetar)*Math.sin(phir));

	//Left Viewport
	gl.viewport(0, 0, canvas.width/2, canvas.height);
	gl.scissor(0, 0, canvas.width/2, canvas.height);
	gl.clearColor(1, 1, 0, .75);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	//Define Matrices
	camRotz = rotate(0,0,psizr);
	M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera = mult(camRotz,lookAt(eye,at,up));
	M_persp1 = perspective2(rightP,topP,nearP*1,farP*1);
	M_ortho = identity();

	//Draw Vertices
	drawScene1(M_ortho, M_persp1, M_camera, M_model) 

	//Second Scene

	//Define Eye & Up
	eye2 = 	vec3(r2*Math.sin(thetar2)*Math.cos(phir2),
			r2*Math.cos(thetar2),
			r2*Math.sin(thetar2)*Math.sin(phir2));

	up2 = 	vec3(Math.cos(thetar2)*Math.cos(phir2),
			-Math.sin(thetar2),
			Math.cos(thetar2)*Math.sin(phir2));

	// Right Viewport	
	gl.viewport(512, 0, canvas.width/2, canvas.height);
	gl.scissor(512, 0, canvas.width/2, canvas.height);
	gl.clearColor(.5, 1, 1, 1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Define Matrices
	camRotz = rotate(0,0,psizr);
	//M_model = rotate(xangle*Math.PI/180,yangle*Math.PI/180,zangle*Math.PI/180);
	M_camera2 = mult(camRotz,lookAt(eye2,at,up2));
	M_persp2 = perspective2(rightP2,topP2,nearP2*1,farP2*1);
	M_ortho = identity();

	//Draw Vertices
	vertices2 = vertices1;
	vertexColors2 = vertexColors1;
	indices2 = indices1;

	drawScene2(M_ortho, M_persp2, M_camera2, M_model)
	
	updateVertices2();
	
	drawScene2(M_ortho, M_persp2, M_camera2, rotate(thetar+(90*Math.PI/180),phir+(90*Math.PI/180),0))

	gl.drawArrays(gl.LINES, 8, 8);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}