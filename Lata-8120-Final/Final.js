
// some globals
var gl;
var canvas;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc, Mp_Loc, Mwv_Loc;
var delay = 50;
var vBuffer, cBuffer, iBuffer, vColor, vPosition;
var program;
var i = 0;
var numVertices;
var M_model; var M_camera; var M_persp; var M_ortho; var M_wv;
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
var camRotz;
var camRoty;
var rightP;
var topP;
var nearP;
var farP;
var L = 1;
var l = 5;
var W_xmax; var W_xmin; var W_ymax; var W_ymin; var W_zmax; var W_zmin;
var lineVertices = [];
var lineColors = [];
var nlines = Math.floor(Math.random()*15)+1;
var j=0;
var p = [Math.random(),Math.random(),Math.random()];
// end globals

window.onload = function init() {
	// get the canvas handle from the document's DOM
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram(program);

	colorLoc = gl.getUniformLocation(program, "vertColor");
	Mwv_Loc = gl.getUniformLocation(program, "M_wv")
	Mm_Loc = gl.getUniformLocation( program, "M_model" );
	Mc_Loc = gl.getUniformLocation( program, "M_camera" );
	Mp_Loc = gl.getUniformLocation( program, "M_persp" );
	Mo_Loc = gl.getUniformLocation( program, "M_ortho" );
	vPosition = gl.getAttribLocation( program, "vPosition");
	vColor = gl.getAttribLocation(program, "vColor");

	vBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();
	iBuffer = gl.createBuffer();

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.SCISSOR_TEST);
	gl.enable(gl.CULL_FACE);

	document.getElementById("theta2").step = .01;
	document.getElementById("phi2").step = .001;
	document.getElementById("r2").step = .01;
	document.getElementById("right2").step = .01;
	document.getElementById("top2").step = .01;
	document.getElementById("near2").step = .01;
	document.getElementById("far2").step = .01;
	document.getElementById("cube").step = .001;

	W_xmax = document.getElementById("xmax").value*1;
	W_xmin = document.getElementById("xmin").value*1;
	W_ymax = document.getElementById("ymax").value*1;
	W_ymin = document.getElementById("ymin").value*1;
	W_zmax = document.getElementById("zmax").value*1;
	W_zmin = document.getElementById("zmin").value*1;

    render();
};

function updateVertices(v,c,i) {

	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(c), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	//bind index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(i),gl.STATIC_DRAW);

	}


function generateLines(t,l,C){
	var a
	var b
	var c
	for (a = -1; a<=1; a++){
		for (b=-1; b<=1; b++){
			for(c=-1;c<=1; c++){
				v = [a,b,c]
				//+x
				if (equal(v,[1,0,0])) {
					lineVertices.push([t,0,0]);
					lineVertices.push([t+l,0,0]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//+y
				if (equal(v,[0,1,0])) {
					lineVertices.push([0,t,0]);
					lineVertices.push([0,t+l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//+z
				if (equal(v,[0,0,1])) {
					lineVertices.push([0,0,t]);
					lineVertices.push([0,0,t+l]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//-x
				if (equal(v,[-1,0,0])) {
					lineVertices.push([-t,0,0]);
					lineVertices.push([-t-l,0,0]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//-y
				if (equal(v,[0,-1,0])) {
					lineVertices.push([0,-t,0]);
					lineVertices.push([0,-t-l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//-z
				if (equal(v,[0,0,-1])) {
					lineVertices.push([0,0,-t]);
					lineVertices.push([0,0,-t-l]);
					lineColors.push(C);
					lineColors.push(C);
				}
				//+x +y
				if (equal(v,[1,1,0])) {
					lineVertices.push([t,t,0]);
					lineVertices.push([t+l,t+l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[1,-1,0])) {
					lineVertices.push([t,-t,0]);
					lineVertices.push([t+l,-t-l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[-1,-1,0])) {
					lineVertices.push([-t,-t,0]);
					lineVertices.push([-t-l,-t-l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[-1,1,0])) {
					lineVertices.push([-t,t,0]);
					lineVertices.push([-t-l,t+l,0]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[0,1,1])) {
					lineVertices.push([0,t,t]);
					lineVertices.push([0,t+l,t+l]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[0,1,-1])) {
					lineVertices.push([0,t,-t]);
					lineVertices.push([0,t+l,-t-l]);
					lineColors.push(C);
					lineColors.push(C);
				}
				
				if (equal(v,[0,-1,-1])) {
					lineVertices.push([0,0-t,-t]);
					lineVertices.push([0,-t-l,-t-l]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[0,-1,1])) {
					lineVertices.push([0,-t,t]);
					lineVertices.push([0,-t-l,t+l]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[1,0,1])) {
					lineVertices.push([t,0,t]);
					lineVertices.push([t+l,0,t+l]);
					lineColors.push(C);
					lineColors.push(C);
				}
				
				if (equal(v,[1,0,-1])) {
					lineVertices.push([t,0,-t]);
					lineVertices.push([t+l,0,-t-l]);
					lineColors.push(C);
					lineColors.push(C);
				}
				
				if (equal(v,[-1,0,-1])) {
					lineVertices.push([-t,0,-t]);
					lineVertices.push([-t-l,0,-t-l]);
					lineColors.push(C);
					lineColors.push(C);
				}

				if (equal(v,[-1,0,1])) {
					lineVertices.push([-t,0,t]);
					lineVertices.push([-t-l,0,t+l]);
					lineColors.push(C);
					lineColors.push(C);			
				}
			}
		}
	}	

}

function generateSparkle(n,l){
	for (i=0;i<n;i++){
		generateLines(i*l,l,[Math.random(),Math.random(),Math.random()]);
	}
}

function eraseSparkle(){
	p = [Math.random()*2-1,Math.random()*2-1,Math.random()*2-1];
	lineVertices = [];
	lineColors = [];
	j=0;
	nlines = Math.floor(Math.random()*15)+1;
}

function render() {

	updateVariables();
	
	//Viewport	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.scissor(0, 0, canvas.width, canvas.height);
	gl.clearColor(.2, .25, .4, 1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//Camera
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
			r*Math.sin(thetar)*Math.sin(phir),
			r*Math.cos(thetar));
	up = 	vec3(Math.cos(thetar)*Math.cos(phir),
			Math.cos(thetar)*Math.sin(phir),
			-Math.sin(thetar));
	//Define Matrices
	camRotz = rotate(0,0,psizr);
	M_wv = worldToNDC(W_xmin,W_xmax,W_ymin,W_ymax,W_zmin,W_zmax);
	M_model = translate(p[0],p[1],p[2]);
	//M_model = identity();
	M_camera = mult(camRotz,lookAt(eye,at,up));
	M_persp = perspective2(rightP,topP,nearP*1,farP*1);
	M_ortho = identity();
	//Create Inner Box
	buildCube(L,-L,L,-L,L,-L,[1,1,1,1]);
	updateVertices(boxVertices,boxColors,boxIndices);
	drawScene(M_ortho, M_persp, M_camera,M_model,boxIndices.length)

	//Create Lines
	//generateSparkle(Math.floor(Math.random()*15)+1,l)
	if (j==nlines){
		eraseSparkle();
		j++
	}
	else
	{
		generateLines(j*l,l,[Math.random(),Math.random(),Math.random()]);
		j++
	}
	updateVertices(lineVertices,lineColors,[])
	drawScene3(M_ortho, M_persp, M_camera,M_model,lineVertices.length)
	drawScene3(M_ortho, M_persp, M_camera,mult(M_model,translate(.01,0,0)),lineVertices.length)
	drawScene3(M_ortho, M_persp, M_camera,mult(M_model,translate(0,0.01,0)),lineVertices.length)
	drawScene3(M_ortho, M_persp, M_camera,mult(M_model,translate(0,0,0.01)),lineVertices.length)


	//create Outer Box
	M_model = identity();
	buildBox(W_xmax,W_xmin,W_ymax,W_ymin,W_zmax,W_zmin,[0,1,1,.5]);
	updateVertices(boxVertices,boxColors,boxIndices);
	drawScene2(M_ortho, M_persp, M_camera, M_model,boxIndices.length)

    setTimeout(
        function (){requestAnimFrame(render());}, delay
	);
}