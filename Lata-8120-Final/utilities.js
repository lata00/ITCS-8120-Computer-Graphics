function updateVariables(){

	theta = document.getElementById("theta2").value*1;
	phi += 1;
	r = document.getElementById("r2").value*1;
	rightP = document.getElementById("right2").value*1;
	topP = document.getElementById("top2").value*1;
	nearP = document.getElementById("near2").value*1;
	farP = document.getElementById("far2").value*1;
	L = document.getElementById("cube").value*1;
	l = document.getElementById("line").value*1;
	

	W_xmax = document.getElementById("xmax").value*1;
	W_xmax = W_xmax ? W_xmax : 0;
	W_xmin = document.getElementById("xmin").value*1;
	W_xmin = W_xmin ? W_xmin : 0;
	W_ymax = document.getElementById("ymax").value*1;
	W_ymax = W_ymax ? W_ymax : 0;
	W_ymin = document.getElementById("ymin").value*1;
	W_ymin = W_ymin ? W_ymin : 0;
	W_zmax = document.getElementById("zmax").value*1;
	W_zmax = W_zmax ? W_zmax : 0;
	W_zmin = document.getElementById("zmin").value*1;
	W_zmin = W_zmin ? W_zmin : 0;

	phir = phi*Math.PI/180;
	psizr = psiz*Math.PI/180;
	thetar = theta*Math.PI/180;
	phir2 = phi2*Math.PI/180;
	thetar2 = theta2*Math.PI/180;

}

function drawScene(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix, N) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	gl.drawElements(gl.TRIANGLES, N, gl.UNSIGNED_BYTE, 0);	
}

function drawScene2(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix,N) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mwv_Loc, false, flatten(M_wv));
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	gl.drawElements(gl.LINES, N, gl.UNSIGNED_BYTE, 0);	
}

function drawScene3(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix,N) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mwv_Loc, false, flatten(M_wv));
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	gl.drawArrays(gl.LINES,0,N);
}

function worldToNDC(xmin,xmax,ymin,ymax,zmin,zmax) {
	wc_width = xmax-xmin;
	wc_height = ymax-ymin;
	wc_depth = zmax-zmin;

	var transl1 = translate(-xmin,-ymin,-zmin);
	var scale1 = scale(2/wc_width,2/wc_height,2/wc_depth);
	var transl2 = translate(-1,-1,-1);

	return mult(transl2, mult(scale1, transl1));
}

function buildBox(xmax,xmin,ymax,ymin,zmax,zmin,colortemp) {
	boxVertices = [];
	boxColors = [];
	boxIndices = [];
	//colortemp = [0,1,1,.5];
	boxVertices.push([xmax,ymax,zmax]);	//0
	boxVertices.push([xmin,ymax,zmax]);	//1
	boxVertices.push([xmax,ymin,zmax]); //2
	boxVertices.push([xmax,ymax,zmin]); //3
	boxVertices.push([xmin,ymin,zmin]);//4
	boxVertices.push([xmax,ymin,zmin]);//5
	boxVertices.push([xmin,ymax,zmin]);//6
	boxVertices.push([xmin,ymin,zmax]);//7
	boxIndices.push(0,1,0,2,0,3,4,5,4,6,4,7,7,2,7,1,3,5,3,6,2,7,2,5,1,6)
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
}

function buildCube(xmax,xmin,ymax,ymin,zmax,zmin,colortemp) {
	boxVertices = [];
	boxColors = [];
	boxIndices = [];
	//colortemp = [0,1,1,.5];
	boxVertices.push([xmin,ymin,zmin]);	//0
	boxVertices.push([xmin,ymax,zmin]);	//1
	boxVertices.push([xmax,ymax,zmin]); //2
	boxVertices.push([xmax,ymin,zmin]); //3
	boxVertices.push([xmin,ymin,zmax]);//4
	boxVertices.push([xmin,ymax,zmax]);//5
	boxVertices.push([xmax,ymax,zmax]);//6
	boxVertices.push([xmax,ymin,zmax]);//7
	boxIndices.push(1, 0, 3,
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
					0, 1, 5	)
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
	boxColors.push(colortemp);
}