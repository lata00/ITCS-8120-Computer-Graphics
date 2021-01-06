function colorCube()
{
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
		vec3(-size+x,-size+y,size+z),
		vec3(-size+x,size+y,size+z),
		vec3(size+x,size+y,size+z),
		vec3(size+x,-size-y,size+z),
		vec3(-size+x,-size+y,-size+z),
		vec3(-size+x,size+y,-size+z),
		vec3(size+x,size+y,-size+z),
		vec3(size+x,-size+y,-size+z)
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

function updateVariables(){
	if (spin==1){
		xangle += vx;
		yangle += vy;
		zangle += vz;
	};

	if (cyspin==1){
		phi += 1;
		updateAngleDisplay();
	};

	if (czspin==1){
		psiz += 1;
		updateAngleDisplay();
	};

	theta = document.getElementById("theta").value*1;
	phir = phi*Math.PI/180;
	psizr = psiz*Math.PI/180;
	thetar = theta*Math.PI/180;

	zm = document.getElementById("zoom").value*1;
	fov = document.getElementById("fov").value*1;
}

function drawScene1(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	numVertices = indices1.length;
	gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);	
}

function drawScene2(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	numVertices = indices2.length;
	gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);	
}