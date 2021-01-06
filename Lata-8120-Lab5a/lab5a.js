
// some globals
var gl;
var canvas;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc, Mp_Loc;
var ap_Loc, dp_Loc, sp_Loc, lp_loc,sh_Loc, vn_Loc;
var delay = 16;
var vBuffer, cBuffer, vColor, iBuffer, nBuffer;
var program;
var color_vals = [];
var i = 0;
var vertexColors = [];
var vertexNormals = [];
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
//shading variables

var attenuationConstant, attenuationLinear, attenuationQuadratic;

var lightAmbient = vec4(0, 0, 0, 1.0);
var lightDiffuse = vec4(0, 0, 0, 1.0);
var lightSpecular = vec4(0, 0, 0, 1.0);
var emission = vec4(0.0, 0.3, 0.3, 1.0);

var materialAmbient = vec4(1.0, 1, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1, 1, 1.0);
var materialSpecular = vec4(1.0, 1, 1, 1.0);
var materialShininess = 100;

var lightPosition = vec4(0, 1, 0 ,1.0);
var lightPosition2 = vec4(0, -1, 0 ,1.0);

var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);

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

	//Get Variable Locations
	colorLoc = gl.getUniformLocation(program, "vertColor");
	Mm_Loc = gl.getUniformLocation( program, "M_model" );
	Mc_Loc = gl.getUniformLocation( program, "M_camera" );
	Mp_Loc = gl.getUniformLocation( program, "M_persp" );
	Mo_Loc = gl.getUniformLocation( program, "M_ortho" );
	ap_Loc = gl.getUniformLocation( program, "ambientProduct" );
	dp_Loc = gl.getUniformLocation( program, "diffuseProduct" );
	sp_Loc = gl.getUniformLocation( program, "specularProduct" );
	sh_Loc = gl.getUniformLocation( program, "shininess" );
	lp_Loc = gl.getUniformLocation( program, "lightPosition" );
	lp2_Loc = gl.getUniformLocation( program, "lightPosition2" );

	vBuffer = gl.createBuffer();
	nBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();
	iBuffer = gl.createBuffer();

	setEventHandlers();
	colorCube();
	subVertices(0,.51,0,.25)

	xangle = 0;
	yangle = 0;
	zangle = 0;

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
	document.getElementById("ambR").step = .01;
	document.getElementById("ambG").step = .01;
	document.getElementById("ambB").step = .01;
	document.getElementById("difR").step = .01;
	document.getElementById("difG").step = .01;
	document.getElementById("difB").step = .01;
	document.getElementById("specR").step = .01;
	document.getElementById("specG").step = .01;
	document.getElementById("specB").step = .01;
	document.getElementById("shin").step = .01;
	document.getElementById("l1x").step = .01;
	document.getElementById("l1y").step = .01;
	document.getElementById("l2z").step = .01;
	document.getElementById("l2x").step = .01;
	document.getElementById("l2y").step = .01;
	document.getElementById("l2z").step = .01;

	document.getElementById("zoom").value = .5;
	document.getElementById("fov").value = .5;
	document.getElementById("ambR").value = 0;
	document.getElementById("ambG").value = 0;
	document.getElementById("ambB").value = 0;
	document.getElementById("difR").value = 0;
	document.getElementById("difG").value = 0;
	document.getElementById("difB").value = 0;
	document.getElementById("specR").value = 0;
	document.getElementById("specG").value = 0;
	document.getElementById("specB").value = 0;

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

	document.getElementById("ambR").onchange = function(event){
		var r = document.getElementById("ambR").value;
		var g = document.getElementById("ambG").value;
		var b = document.getElementById("ambB").value;
		lightAmbient = vec4(r, g, b, 1.0);
	}
	document.getElementById("ambG").onchange = function(event){
		var r = document.getElementById("ambR").value;
		var g = document.getElementById("ambG").value;
		var b = document.getElementById("ambB").value;
		lightAmbient = vec4(r, g, b, 1.0);
	}
	document.getElementById("ambB").onchange = function(event){
		var r = document.getElementById("ambR").value;
		var g = document.getElementById("ambG").value;
		var b = document.getElementById("ambB").value;
		lightAmbient = vec4(r, g, b, 1.0);
	}
	document.getElementById("difR").onchange = function(event){
		var r = document.getElementById("difR").value;
		var g = document.getElementById("difG").value;
		var b = document.getElementById("difB").value;
		lightDiffuse = vec4(r, g, b, 1.0);
	}
	document.getElementById("difG").onchange = function(event){
		var r = document.getElementById("difR").value;
		var g = document.getElementById("difG").value;
		var b = document.getElementById("difB").value;
		lightDiffuse = vec4(r, g, b, 1.0);
	}
	document.getElementById("difB").onchange = function(event){
		var r = document.getElementById("difR").value;
		var g = document.getElementById("difG").value;
		var b = document.getElementById("difB").value;
		lightDiffuse = vec4(r, g, b, 1.0);
	}
	document.getElementById("specR").onchange = function(event){
		var r = document.getElementById("specR").value;
		var g = document.getElementById("specG").value;
		var b = document.getElementById("specB").value;
		lightSpecular = vec4(r, g, b, 1.0);
	}
	document.getElementById("specG").onchange = function(event){
		var r = document.getElementById("specR").value;
		var g = document.getElementById("specG").value;
		var b = document.getElementById("specB").value;
		lightSpecular = vec4(r, g, b, 1.0);
	}
	document.getElementById("specB").onchange = function(event){
		var r = document.getElementById("specR").value;
		var g = document.getElementById("specG").value;
		var b = document.getElementById("specB").value;
		lightSpecular = vec4(r, g, b, 1.0);
	}
	document.getElementById("shin").onchange = function(event){
		materialShininess = document.getElementById("shin").value;
	}
	document.getElementById("l1x").onchange = function(event){
		var r = document.getElementById("l1x").value;
		var g = document.getElementById("l1y").value;
		var b = document.getElementById("l1z").value;
		lightPosition = vec4(r, g, b, 1.0);
	}
	document.getElementById("l1y").onchange = function(event){
		var r = document.getElementById("l1x").value;
		var g = document.getElementById("l1y").value;
		var b = document.getElementById("l1z").value;
		lightPosition = vec4(r, g, b, 1.0);
	}
	document.getElementById("l1z").onchange = function(event){
		var r = document.getElementById("l1x").value;
		var g = document.getElementById("l1y").value;
		var b = document.getElementById("l1z").value;
		lightPosition = vec4(r, g, b, 1.0);
	}
	document.getElementById("l2x").onchange = function(event){
		var r = document.getElementById("l2x").value;
		var g = document.getElementById("l2y").value;
		var b = document.getElementById("l2z").value;
		lightPosition2 = vec4(r, g, b, 1.0);
	}
	document.getElementById("l2y").onchange = function(event){
		var r = document.getElementById("l2x").value;
		var g = document.getElementById("l2y").value;
		var b = document.getElementById("l2z").value;
		lightPosition2 = vec4(r, g, b, 1.0);
	}
	document.getElementById("l2z").onchange = function(event){
		var r = document.getElementById("l2x").value;
		var g = document.getElementById("l2y").value;
		var b = document.getElementById("l2z").value;
		lightPosition2 = vec4(r, g, b, 1.0);
	}
};

function updateAngleDisplay() {
	document.getElementById("xangle").value = Math.round(xangle%360);
	document.getElementById("yangle").value = Math.round(yangle%360);
	document.getElementById("zangle").value = Math.round(zangle%360);
	document.getElementById("cyangle").value = Math.round(phi%360);
	document.getElementById("czangle").value = Math.round(psiz%360);
}

function updateVertices() {

	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	vPosition = gl.getAttribLocation( program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	//gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
	//vColor = gl.getAttribLocation(program, "vColor");
    //gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	//gl.enableVertexAttribArray(vColor);

	//bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);

	vertexNormals = vertices;

	//bind normal buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW);
	vNormal = gl.getAttribLocation( program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);

	//update Lighting
	ambientProduct = mult(lightAmbient, materialAmbient);
	gl.uniform4fv(ap_Loc, ambientProduct);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(dp_Loc, diffuseProduct);
	specularProduct = mult(lightSpecular, materialSpecular);
	gl.uniform4fv(sp_Loc, specularProduct);
	gl.uniform4fv(lp_Loc, lightPosition);
	gl.uniform4fv(lp2_Loc, lightPosition2);
	gl.uniform1f(sh_Loc, materialShininess);
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
	updateVariables()
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