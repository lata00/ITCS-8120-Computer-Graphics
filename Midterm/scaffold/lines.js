
// some globals

var gl;

var M_wrld_ndc_loc, M_wrld_ndc;
var M, M_loc;
var M_rotate_loc,M_rotate;
var delay = 100;
var vBuffer, cBuffer;
var program;
var vertices = [];
var vcolors = [];
var A = -5;
var canvas;
//
// world coordinate system, feel free to change to any legal window
//
var wc_min = [-1., -10.], wc_max = [1., 10.]
var wc_width = wc_max[0]-wc_min[0];
var wc_height = wc_max[1]-wc_min[1];
colorLoc = document.getElementById("vertColor");

window.onload = function init() {
	// get the canvas handle from the document's DOM
    canvas = document.getElementById( "gl-canvas" );
    
	// initialize webgl
    gl = WebGLUtils.setupWebGL( canvas );

	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}

    // set up a viewing surface to display your image
    gl.viewport( 0, 0, canvas.width, canvas.height );

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

	// make this the current shader program
    gl.useProgram( program );

	// create a vertex, color buffers
    vBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();

	// get the world to ndc matrix location
	M_loc = gl.getUniformLocation(program, "M_transform");

	// compute the transform
	M = identity();

	gl.uniformMatrix4fv(M_loc, false, flatten(M));

	// get the world to ndc matrix location
	M_rotate_loc = gl.getUniformLocation(program, "M_rotate");

	// compute the transform
	M_rotate = identity();

	gl.uniformMatrix4fv(M_rotate_loc, false, flatten(M_rotate));

	// get the world to ndc matrix location
	M_wrld_ndc_loc = gl.getUniformLocation(program, "M_wrld_to_ndc");

	// compute the transform
	M_wrld_ndc = worldToNDC (wc_min, wc_max);
	

	// share with shader
	gl.uniformMatrix4fv(M_wrld_ndc_loc, false, flatten(M_wrld_ndc));

	createGeometry();

    render();
}

function createGeometry() {
	vertices.push([0., 0., 0., 1.],	
				  [1., 0., 0., 1.]
				);

	// make the needed GL calls to tranfer vertices

	// bind the buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// transfer the data 
	// flatten() function is defined in matrix.js - this simply creates only
	// the vertex coordinate data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	// Associate out shader variables with our data buffer
	// note: "vposition" is a named variable used in the vertex shader and is
	// associated with vPosition here
	var vPosition = gl.getAttribLocation( program, "vPosition");

	// specify the format of the vertex data - here it is a float with
	// 2 coordinates per vertex - these are its attributes
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

	// enable the vertex attribute array 
	gl.enableVertexAttribArray(vPosition);

	colorBuffer([1,0,0,1]);

	render();
}

function colorBuffer(c) {
	
	vcolors= 	[c,
				c];
	// bind the color buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

	// transfer the data 
	// flatten() function is defined in matrix.js - this simply creates only
	// the color data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vcolors), gl.STATIC_DRAW);
	
	// Associate out shader variables with our data buffer
	// note: "vColor" is a named variable used in the vertex shader and is
	// associated with vPosition here
	var vColor = gl.getAttribLocation(program, "vColor");

	// specify the format of the vertex data - 4 component color
	// r,g,b,a - 4 floats - these are its attributes
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	// enable the vertex attribute array 
	gl.enableVertexAttribArray(vColor);

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
j=0;
function render() {
	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	// just draw the original line but using world coordinates.
	//drawLine();
	A = -.25*wc_height;
	drawAxes();
	drawTicks();
	//colorBuffer([1,1,0,1]);
	drawSinusoid();
	M_rotate = rotate2D(j*Math.PI*.01); 
	gl.uniformMatrix4fv(M_rotate_loc, false, flatten(M_rotate));
	j++;
    setTimeout(
        function (){
			requestAnimFrame(render);
		}, delay );
}

function drawLine() {
	gl.drawArrays(gl.LINES, 0, 2);
	gl.drawArrays(gl.POINTS, 0, 1);
}

function drawAxes() {
	//Draw Horizontal axis
	M = scale2D(wc_width,1);
	M = mult(translate2D(-wc_width/2,0),M)
	gl.uniformMatrix4fv(M_loc, false, flatten(M));
	gl.drawArrays(gl.LINES, 0, 2);
	//Draw Vertical Axis
	M = scale2D(wc_height,1);
	M = mult(translate2D(-wc_height/2,0),M);
	M = mult(rotate2D(Math.PI/2),M);
	gl.uniformMatrix4fv(M_loc, false, flatten(M));
	gl.drawArrays(gl.LINES, 0, 2);
}

function drawTicks() {
	//Draw Vertical Ticks
	for (i = wc_min[1]; i <= wc_max[1] ; i+=.05*wc_height){
		M = translate2D(-.5,i);
		M = mult(scale2D(wc_width*.05,1),M);
		gl.uniformMatrix4fv(M_loc, false, flatten(M));
		gl.drawArrays(gl.LINES, 0, 2);
	}
	//Draw Horizontal Ticks
	for (i = wc_min[0]; i <= wc_max[0] ; i+=.05*wc_width){
		M = translate2D(-.5,i);
		M = mult(rotate2D(Math.PI/2),M);
		M = mult(scale2D(1,wc_height*.05),M);
		gl.uniformMatrix4fv(M_loc, false, flatten(M));
		gl.drawArrays(gl.LINES, 0, 2);
	}
}

function drawSinusoid() {
	for (i = wc_min[0]; i <= wc_max[0] ; i+=.25*wc_width*.1) {
		M = translate2D(i,A*Math.sin(i*Math.PI/wc_max[0]));
		gl.uniformMatrix4fv(M_loc, false, flatten(M));
		gl.drawArrays(gl.POINTS,0,1);
	}
}

