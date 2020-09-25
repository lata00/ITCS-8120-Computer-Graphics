
// some globals
var gl;
var up = 1;
var x = -1;
var y = -1;
var transdir = 0;
var colorLoc, M_Loc, scaleLoc, transLoc;
var delay = 100;
var vBuffer, cBuffer;
var program;
var vertices = [];
var vcolors = [];
var color_vals = [1.0, 0., 0., 1.0];
var i = 0;
var xform_mode = {
		Translate: 0,
		Rotate: 1,
		Scale: 2
	};
var inc = .1;
var selection = xform_mode.Rotate;

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
    gl.viewport( 0, 0, canvas.width, canvas.height );

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

	// make this the current shader program
    gl.useProgram( program );

	// Get a handle to transform matrix  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    M_Loc = gl.getUniformLocation( program, "M_Transform" );

	// we are also going manipulate the vertex color, so get its location
	colorLoc = gl.getUniformLocation(program, "vertColor");

	// set an initial color for all vertices
	gl.uniform4fv (colorLoc, [1., 0., 0., 1.])

	// create a vertex buffer - this will hold all vertices
    vBuffer = gl.createBuffer();

	// create a vertex buffer
    cBuffer = gl.createBuffer();

	// create event handlers
	setEventHandlers();

	initVertices();

    render();
};

function setEventHandlers() {
	document.getElementById("Transformations").onclick = function(event) {
		i=0;
		switch( event.target.index ) {
          case xform_mode.Translate: 
				selection = xform_mode.Translate; 
				break;
          case xform_mode.Rotate: selection = xform_mode.Rotate; 
				break;
          case xform_mode.Scale : selection = xform_mode.Scale; 
				break;
       }
	}
}
function initVertices(){
	vertices.push([ 0.0,  0.3]); 
	vertices.push([-0.3,  0.0]); 
	vertices.push([ 0.0, -0.3]); 

	// triangle 2
	vertices.push([ 0.0,  0.3]); 
	vertices.push([ 0.0, -0.3]); 
	vertices.push([ 0.3,  0.0]); 

	num_triangles = 2;
}
function updateVertices() {
	// add a square at the center of the view (0, 0) of a fixed size
	// triangle 1


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
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable the vertex attribute array 
	gl.enableVertexAttribArray(vPosition);

	// we will use a single color for all primitives and so we will directly set
	// the color in the GPU's fragment shader. If you do need to set individual
	// colors for each vertex, then you will need to send a color buffer, 
	// similar to the vertex buffer, with associated shader variables for color.

}

function render() {
	// this is render loop

	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
	// each
	updateVertices();

	var xform;
	
	switch (selection) {
		case xform_mode.Translate:
			console.log("Translate");
			xform = translate(x,y);
			switch (transdir) {
				case 0:
					x+=inc;
					break;
				case 1:
					y+=inc;
					break;
				case 2:
					x-=inc;
					break;
				case 3:
					y-=inc;
					break;
			}
			if (x <= -1 && y <= -1) {
				transdir = 0;
			}
			if (x >= .9 && y <= -1) {
				transdir = 1;
			}
			if (x >= .9 && y >= .9) {
				transdir = 2;
			}
			if (x <= -1 && y >= .9) {
				transdir = 3;
			}

			break;
		case xform_mode.Scale:
			// You will simulate zoom in/out by smoothly scaling down the square
			// and then scaling up the square, in a continouse animation  
			console.log("Scale");
			xform = scale(i);	
			switch (up){
				case 0:
					i-=inc;
					break;
				case 1:
					i+=inc;
					break;
				}
			if (i>3){
				up = 0;
			}
			if (i<=0){
				up = 1;
			}
			break;
		case xform_mode.Rotate:
			// you will smoothly rotate the square  through 360 degrees, switch 
			// direction and rotate it in the opposite direction, in a continous
			// animation
			console.log("Rotate");
			xform = rotate(i%(2*Math.PI));
			switch (up){
				case 0:
					i-=inc;
					break;
				case 1:
					i+=inc;
					break;
				}
			if (i>=2*Math.PI){
				up = 0;
			}
			if (i<=0){
				up=1;
			}
			break;
	}
		
	gl.uniformMatrix4fv(M_Loc, false, flatten(xform));

	// set the color in the shader
	gl.uniform4fv (colorLoc, color_vals)

	// draw the square as a triangle strip
    gl.drawArrays(gl.TRIANGLES, 0, num_triangles*3);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}