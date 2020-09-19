
// some globals
var gl;

var theta = 0.0;
var thetaLoc, colorLoc;

var delay = 100;
var direction = true;
var vBuffer, cBuffer;
var program;
var vertices = [];
var vcolors = [];
var color_vals = [];
var xOffset = Math.random();
var yOffset = Math.random();
var rColor;

var max_prims = 200, num_triangles = 0;

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

	// Get a handle to theta  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    thetaLoc = gl.getUniformLocation( program, "theta" );

	// we are also going manipulate the vertex color, so get its location
	colorLoc = gl.getUniformLocation(program, "vertColor");

	// set an initial color for all vertices
	gl.uniform4fv (colorLoc, color_vals)

	// create a vertex buffer - this will hold all vertices
    vBuffer = gl.createBuffer();

	// create a vertex buffer
    cBuffer = gl.createBuffer();

    render();
};

    
function updateVertices() {
    
    // add a square at the center of the view (0, 0) of a fixed size
    // triangle 1
    rColor = [Math.random(), Math.random(), Math.random(), 1.];
	vertices.push([ 0.0 + xOffset,  0.05 + yOffset]); 
	vertices.push([-0.05 + xOffset,  0.0 + yOffset]); 
    vertices.push([ 0.0 + xOffset, -0.05 + yOffset]); 
    
    color_vals.push(rColor);
    color_vals.push(rColor);
    color_vals.push(rColor);

	// triangle 2
	vertices.push([ 0.0 + xOffset,  0.05 + yOffset]); 
	vertices.push([ 0.0 + xOffset, -0.05  + yOffset]); 
    vertices.push([ 0.05 + xOffset,  0.0  + yOffset]); 

    color_vals.push(rColor);
    color_vals.push(rColor);
    color_vals.push(rColor);

	num_triangles = Math.min(vertices.length/3, max_prims*2);

	// make the needed GL calls to tranfer vertices

	// bind the buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// transfer the data -- this is actually pretty inefficient!
	// flatten() function is defined in MV.js - this simply creates only
	// the vertex coordinate data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);
	
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
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(color_vals), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

}

counter = 0;
function render() {
	// this is render loop
     
	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );
    
	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
    // each
    xOffset = Math.random()*1.5-.75;
    yOffset = Math.random()*1.5-.75;
	updateVertices();
    
	theta += 0.1;
	counter++;
	
	// set the theta value
	gl.uniform1f(thetaLoc, theta);

	// set the color, change it every 10 frames
	counter++;
	//if (counter%10 == 0)
        //color_vals = [Math.random(), Math.random(), Math.random(), 1.];
        

	// set the color in the shader
	gl.uniform4fv (colorLoc, color_vals)

	// draw the square as a triangle strip
    gl.drawArrays(gl.TRIANGLES, 0, num_triangles*3);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
