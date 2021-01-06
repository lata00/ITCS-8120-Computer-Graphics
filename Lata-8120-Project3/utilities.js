function updateVariables(){

	theta = document.getElementById("theta2").value*1;
	phi = document.getElementById("phi2").value*1;
	r = document.getElementById("r2").value*1;
	rightP = document.getElementById("right2").value*1;
	topP = document.getElementById("top2").value*1;
	nearP = document.getElementById("near2").value*1;
	farP = document.getElementById("far2").value*1;
	l = document.getElementById("size").value*1;
	cell = document.getElementById("cell").value*1;
	c = document.getElementById("cohesion").value*1;
	s = document.getElementById("seperation").value*1;
	af = document.getElementById("alignment").value*1;

	phir = phi*Math.PI/180;
	psizr = psiz*Math.PI/180;
	thetar = theta*Math.PI/180;
	phir2 = phi2*Math.PI/180;
	thetar2 = theta2*Math.PI/180;

	f = document.getElementById("speed").value*1;

}

function drawScene(orthographicMatrix, perspectiveMatrix, cameraMatrix, modelMatrix) {

	M_model = modelMatrix;
	M_camera = cameraMatrix;
	M_persp = perspectiveMatrix;
	M_ortho = orthographicMatrix;
	gl.uniformMatrix4fv(Mm_Loc, false, flatten(M_model));
	gl.uniformMatrix4fv(Mc_Loc, false, flatten(M_camera));
	gl.uniformMatrix4fv(Mp_Loc, false, flatten(M_persp));
	gl.uniformMatrix4fv(Mo_Loc, false, flatten(M_ortho));
	//gl.uniform4fv(colorLoc, flatten(vertexColors));
	numVertices = boidIndices.length;
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
	numVertices = boxIndices.length;
	gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);	
}

function tetrahedronVertices(p,l){
	x = p[0];
	y = p[1];
	z = p[2];
	boidVertices.push([x+l*Math.sqrt(8/9),y,z-l*(1/3)]);
	boidVertices.push([x-l*Math.sqrt(2/9),y+l*Math.sqrt(2/3),z-l*(1/3)]);
	boidVertices.push([x-l*Math.sqrt(2/9),y-l*Math.sqrt(2/3),z-l*(1/3)]);
	boidVertices.push([x,y,z+l]);
}

function tetrahedronColors(hue){
	rgb = hsv2rgb([hue*255,1,1]);
	boidColors.push(rgb);
	boidColors.push(rgb);
	boidColors.push(rgb);
	boidColors.push(rgb);
 }

 function tetrahedronIndices(i) {
	boidIndices.push(
		 i+0,i+1,i+2,
		 i+1,i+2,i+3,
		 i+2,i+3,i+0,
		 i+3,i+0,i+1,
		 i+1,i+0,i+2,
		 i+2,i+1,i+3,
		 i+3,i+2,i+0,
		 i+0,i+3,i+1,		
	 )
 }

 class Boid {
	constructor(position,hue,size,velocity) {
	  this.position = position;
	  this.hue = hue;
	  this.size = size;
	  this.velocity = velocity;
	  this.direction = normalize(velocity);
	  this.speed = Math.sqrt(dot(velocity,velocity));
	  this.neighborhood = [];
	  this.neighbors = [];
	  this.cohesionForce = [];
	  this.seperationForce = [];
	  this.alignmentForce =[];
	}

	move(){
		if(this.position[0]<L-l & this.position[0]>-L+l ){
			this.position[0] = this.position[0] + this.velocity[0]*f;
		}
		else{
			this.velocity[0] = -this.velocity[0];
			this.position[0] = this.position[0] + (this.velocity[0])*f;
		}

		if(this.position[1]<L-l & this.position[1]>-L+l){
			this.position[1] = this.position[1] + (this.velocity[1])*f;
		}
		else{
			this.velocity[1] = -this.velocity[1]
			this.position[1] = this.position[1] + (this.velocity[1])*f;
		}

		if(this.position[2]<L-l & this.position[2]>-L+l){
			this.position[2] = this.position[2] + (this.velocity[2])*f;
		}
		else{
			this.velocity[2] = -this.velocity[2]
			this.position[2] = this.position[2] + (this.velocity[2])*f;
		}
		
	}
	
	getNeighbors(b){
		for (i=0;i<b.length;i++){
			if (equal(b[i].neighborhood,this.neighborhood)){
				this.neighbors.push(b[i]);
			}
		}
	}

	getNeighborhood(){
		var p = this.position;
		this.neighborhood[0] = Math.round(p[0]/cell);
		this.neighborhood[1] = Math.round(p[1]/cell);
		this.neighborhood[2] = Math.round(p[2]/cell);
	}
  }

  function rgb2hsv (C) {
	  C[0] = r;
	  C[1] = g;
	  C[2] = b;

    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
	}
	h = Math.round(h * 360),
	s = percentRoundFn(s * 100),
	v = percentRoundFn(v * 100)
	return [h,s,v];
}

function hsv2rgb(C) {
	h = C[0];
	s = C[1];
	v = C[2];
	var r, g, b;
  
	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
  
	switch (i % 6) {
	  case 0: r = v, g = t, b = p; break;
	  case 1: r = q, g = v, b = p; break;
	  case 2: r = p, g = v, b = t; break;
	  case 3: r = p, g = q, b = v; break;
	  case 4: r = t, g = p, b = v; break;
	  case 5: r = v, g = p, b = q; break;
	}
  
	return [ r, g, b , 1 ];
  }