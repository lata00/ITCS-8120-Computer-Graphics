function updateVariables(){
	box = document.getElementById("mode").value*1;
}
// conversion from world coords to NDC
function worldToNDC(wc_min, wc_max) {

	var transl1 = mat4(	vec4(1., 0., 0., -wc_min[0]),
						vec4(0., 1., 0., -wc_min[1]),
						vec4(0., 0., 1., 0.),
						vec4()
					);
	var scale = mat4(	vec4(2./wc_width, 0.0, 0.0, 0.0),
						vec4(0.0, 2./wc_height, 0.0, 0.0),
						vec4(0.0, 0.0, 1.0, 0.0),
						vec4()
					);
	var transl2 = mat4(	vec4(1., 0., 0., -1.),
						vec4(0., 1., 0., -1.),
						vec4(0., 0., 1., 0.),
						vec4()
					);

	return mult(transl2, mult(scale, transl1));
}

function Clip(vs){
	for (i = 0; i < vs.length; i+=2) {
		yMax = Math.max(boxy,boxy2);
		yMin = Math.min(boxy,boxy2);
		xMax = Math.max(boxx,boxx2);
		xMin = Math.min(boxx,boxx2);
		x1 = vs[i][0];
		x2 = vs[i+1][0];
		y1 = vs[i][1];
		y2 = vs[i+1][1];
		a[0] = y1 > yMax ? 1:0;
		a[1] = y1 < yMin ? 1:0;
		a[2] = x1 > xMax ? 1:0;
		a[3] = x1 < xMin ? 1:0;
		b[0] = y2 > yMax ? 1:0;
		b[1] = y2 < yMin ? 1:0;
		b[2] = x2 > xMax ? 1:0;
		b[3] = x2 < xMin ? 1:0;

		A = a.join();
		A = A.replaceAll(",","");
		AA = a[0]+a[1]+a[2]+a[3];
		B = b.join();
		B = B.replaceAll(",","");
		BB = b[0]+b[1]+b[2]+b[3];
		C = parseInt(A,2) & parseInt(B,2);

		if(x1<x2){m = (y2-y1)/(x2-x1)}
		else{m = (y1-y2)/(x1-x2)}
		
		if(A == 0 & B == 0){
			
		}

		else if (A == 0 & B != 0) {
			if (BB == 1){
				if(b[0] == 1){
					vs[i+1][1] = yMax;
					vs[i+1][0] = (yMax - y1)/m + x1;
				}
				if(b[1] == 1){
					vs[i+1][1] = yMin;
					vs[i+1][0] = (yMin - y1)/m + x1;
				}
				if(b[2] == 1){
					vs[i+1][0] = xMax;
					vs[i+1][1] = (xMax - x1)*m + y1;
				}
				if(b[3] == 1){
					vs[i+1][0] = xMin;
					vs[i+1][1] = (xMin - x1)*m + y1;
				}
			}
		}

		else if (A != 0 & B == 0) {
			if (AA == 1){
				if(a[0] == 1){
					vs[i][1] = yMax;
					vs[i][0] = (yMax - y2)/m + x2;
				}
				if(a[1] == 1){
					vs[i][1] = yMin;
					vs[i][0] = (yMin - y2)/m + x2;
				}
				if(a[2] == 1){
					vs[i][0] = xMax;
					vs[i][1] = (xMax - x2)*m + y2;
				}
				if(a[3] == 1){
					vs[i][0] = xMin;
					vs[i][1] = (xMin - x2)*m + y2;
				}
			}			
		}
		
		else if (C != 0) {
			vs.splice(i,2)
		}

		else if (C == 0){
			intersection(vs[i],vs[i+1]);
		}
	}
	return vs;
}
