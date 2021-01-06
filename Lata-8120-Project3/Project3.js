
// some globals
var gl;
var canvas;
var colorLoc, Mm_Loc, Mc_Loc, Mo_Loc, Mp_Loc;
var delay = 16;
var vBuffer, cBuffer, iBuffer, vColor, vPosition;
var program;
var i = 0;
var boidColors = [];
var boidVertices = [];
var boidIndices = [];
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
var camRotz;
var camRoty;
var rightP;
var topP;
var nearP;
var farP;
var bx;
var by;
var bz;
var Boidz = [];
var N = 100;
var L = 100;
var l = 1;
var f = 0;
var vnew = [];
var boxVertices = [];
var boxColors = [];
var boxIndices = [];
var cell;
var c = 1;
var s = .1;
var af = 1;
var D;
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
	document.getElementById("speed").step = .01;
	document.getElementById("size").step = .01;
	document.getElementById("cell").step = .01;
	document.getElementById("cohesion").step = .000001;

	generateBoidz(50);
	//Boidz[0] = new Boid([0,0,0],0,1,[0,0,1]);
	//Boidz[1] = new Boid([0,0,10],.5,1,[0,0,1]);
	//Boidz[2] = new Boid([0,10,0],1,1,[0,0,1]);

	buildBoidz(Boidz);

    render();
};

function generateBoidz(n){
	for (i = 0; i<n; i++){
		p = [(Math.random()*2*L)-L,(Math.random()*2*L)-L,(Math.random()*2*L)-L];
		hue = Math.random();
		v = [Math.random()-.5,Math.random()-.5,Math.random()-.5];
		Boidz[i] = new Boid(p,hue,1,v);
		}
}

function buildBoidz(b){
	boidIndices = [];
	boidVertices=[];
	boidColors = [];
	for (i = 0; i < b.length; i++){
		tetrahedronIndices(boidVertices.length);
		tetrahedronVertices(b[i].position,b[i].size);
		tetrahedronColors(b[i].hue);
		b[i].size = l;
		}
}

function buildBox(x,y,z) {
	boxVertices = [];
	boxColors = [];
	boxIndices = [];
	boxVertices.push([x,y,z]);	//0
	boxVertices.push([-x,y,z]);	//1
	boxVertices.push([x,-y,z]); //2
	boxVertices.push([x,y,-z]); //3
	boxVertices.push([-x,-y,-z]);//4
	boxVertices.push([x,-y,-z]);//5
	boxVertices.push([-x,y,-z]);//6
	boxVertices.push([-x,-y,z]);//7
	boxIndices.push(0,1,0,2,0,3,4,5,4,6,4,7,7,2,7,1,3,5,3,6,2,7,2,5,1,6)
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
	boxColors.push([1,1,1,1]);
}

function buildNeighborhoods(b){
	for (i = 0; i < b.length; i++){
		b[i].neighbors = [];
		b[i].getNeighborhood();
	}
	for (i=0;i<b.length;i++){
		for(j=0;j<b.length;j++){
			if(equal(b[i].neighborhood,b[j].neighborhood)){
				if(equal(b[i].position,b[j].position)){
					continue;	
				}
				else{
					b[i].neighbors.push(b[j]);
				}
				
			}
		}
	}

}

function calculateForces(b){
	for(i=0;i<b.length;i++){
		b[i].seperationForce = [0,0,0];
		b[i].alignmentForce = [0,0,0];
		if(b[i].neighbors.length == 0){
			b[i].cohesionForce = [0,0,0];
			b[i].seperationForce = [0,0,0];
			continue;
		}
		var p = b[i].neighbors[0].position;
		var q = [0,0,0];
		for(j=0;j<b[i].neighbors.length;j++){
			d = subtract(b[i].position,b[i].neighbors[j].position);
			D = dot(d,d);
			d = normalize(d);
			d = d.map(x=>x/D);
			q = average3(q,d);
			p = average3(b[i].neighbors[j].position,p);
			b[i].cohesionForce = subtract(p,b[i].position);
			b[i].seperationForce = q;
			b[i].alignmentForce = subtract(b[i].direction,b[i].neighbors[j].direction);
		}
	}
}

function colorBoidz(b){
	for(i=0;i<b.length;i++){
		if(b[i].neighbors.length == 0){
			continue;
		}
		var h = b[i].neighbors[0].hue;
		for(j=0;j<b[i].neighbors.length;j++){
			h = (h + b[i].neighbors[j].hue)/2;
			b[i].hue = h;
		}
	}
}

function turnBoidz(b){
	for (i = 0; i < b.length; i++){
		var tempv = b[i].velocity;
		var dV = b[i].cohesionForce.map(x => x*c*f/1000);
		dV = add(dV,b[i].seperationForce.map(x => x*s*f));
		dV = add(dV,b[i].alignmentForce.map(x => x*af*f));
		b[i].velocity = add(tempv,dV);
		b[i].direction = normalize(b[i].velocity);
		b[i].speed = Math.sqrt(dot(b[i].velocity,b[i].velocity));
		if (b[i].speed > 10){
			b[i].velocity = b[i].direction.map(x=>x*10);
		}
	}
}

function moveBoidz(b){
	for (i = 0; i < b.length; i++){
		b[i].move();
		}
}

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


function render() {

	updateVertices(boidVertices,boidColors,boidIndices);
	updateVariables();



	//Define Eye & Up
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
			r*Math.sin(thetar)*Math.sin(phir),
			r*Math.cos(thetar));
	up = 	vec3(Math.cos(thetar)*Math.cos(phir),
			Math.cos(thetar)*Math.sin(phir),
			-Math.sin(thetar));

	//Define Matrices
	camRotz = rotate(0,0,psizr);
	M_model = identity();
	M_camera = mult(camRotz,lookAt(eye,at,up));
	M_persp1 = perspective2(rightP,topP,nearP*1,farP*1);
	M_ortho = identity();

	//Define Eye & Up
	eye = 	vec3(r*Math.sin(thetar)*Math.cos(phir),
			r*Math.sin(thetar)*Math.sin(phir),
			r*Math.cos(thetar));
	up = 	vec3(-Math.cos(thetar)*Math.cos(phir),
			-Math.cos(thetar)*Math.sin(phir),
			Math.sin(thetar));

	// Right Viewport	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.scissor(0, 0, canvas.width, canvas.height);
	gl.clearColor(.2, .25, .3, 1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//Define Matrices
	camRotz = rotate(0,0,psizr);
	M_camera = mult(camRotz,lookAt(eye,at,up));
	M_persp = perspective2(rightP,topP,nearP*1,farP*1);
	M_ortho = identity();

	buildNeighborhoods(Boidz);
	colorBoidz(Boidz);
	calculateForces(Boidz);
	turnBoidz(Boidz);
	moveBoidz(Boidz);
	buildBoidz(Boidz);

	drawScene(M_ortho, M_persp, M_camera, M_model)

	buildBox(L,L,L);
	updateVertices(boxVertices,boxColors,boxIndices);
	drawScene2(M_ortho, M_persp, M_camera, M_model)


    setTimeout(
        function (){requestAnimFrame(render);}, delay
	);
	i++;
}