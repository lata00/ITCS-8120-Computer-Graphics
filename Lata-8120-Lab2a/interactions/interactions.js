
var gl;

var delay = 100;
var selection = 1;
var canvas;
var vBuffer, cBuffer;
var down = false;
var textArea = document.getElementById("myTextArea");
var mouseDown = 0;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Create a buffer to hold the  vertices
    vBuffer = gl.createBuffer();

    // Create a buffer to hold the  colors
    cBuffer = gl.createBuffer();

	// create vertices, colors and set attributes for GL
	updateVertices(program);

	// set mouse and keyboard handlers
	setEventHandlers();

	render();
}

function updateVertices(program) {
	// this function loads the vertex and color data into the respective buffers
	// note that in this basic program, the vertices dont change and thus is called
	// once at the beginning (by the init()) method. In applications where the vertices
	// are changing, this needs to be calle repeatedly to load the vertices onto the GPU

	// set vertices for the primitives - we will put these into a
	// a single array and use indices to refer to each primitive
    var vertices = [
		vec2(  0,  1 ),    // Tri 1 start
		vec2(  -1,  0 ),
		vec2( 0,  -1 ),		
		vec2(  0,  1 ),		// Tri 2 start
		vec2(  0, -1 ),
		vec2(  1, 0 ),

        vec2(  -1,  0 ),  	// triangle strip start
        vec2(   0,  1 ),
        vec2(   0,  -1 ),
        vec2(   1, 0 ),

        vec2(  0, -1 ), 	// fan verts start
        vec2(  -1,  0 ),
        vec2(  0, 1 ),
        vec2(  1,  0 ),

							// axes vertices
		vec2(-1, 0), 
		vec2( 1, 0), 
		vec2( 0, -1), 
		vec2( 0, 1) 
    ];

	// set vertex colors for the primitives
	var vertex_colors = [
					// tri colors
		[1., 0., 0., 1.],  // red
		[1., 0., 1., 1.],  // magenta
		[0., 1., 0., 1.],  // green
		[1., 0., 0., 1.],  // red
		[0., 1., 0., 1.],  // green
		[1., 1., 0., 1.], // yellow

						// strip colors
		[1., 0., 0., 1.],  // red  
		[0., 1., 0., 1.],  // green
		[0., 0., 1., 1.],  // blue
		[1., 0., 1., 1.], // magenta

						// fan colors
		[0., 1., 1., 1.], // cyan
		[0., 1., 0., 1.],  // green
		[0., 0., 1., 1.],  // blue
		[1., 0., 1., 1.], // magenta

		
						// axes colors
		[1., 0., 0., 1.],  // red  
		[0., 1., 0., 1.],  // green
		[0., 0., 1., 1.],  // blue
		[1., 1., 0., 1.], // yellow
	];

	// bind it to make it active
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// send the data as an array to GL

	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    				// Associate out shader variables with our data buffer

	// get a location to the vertex position's shader variable ('vPosition')
    var vPosition = gl.getAttribLocation( program, "vPosition");
	
	// specifies the vertex attribute information (in an array), used
	// for rendering 
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable this attribute, with the given attribute name
    gl.enableVertexAttribArray(vPosition);

					// now do the color buffer

	// bind it to make it active
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

	// send the color data as an array to GL
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertex_colors), gl.STATIC_DRAW);

	// get a location to the color attribute'sp location ('vColor')
    var vColor = gl.getAttribLocation( program, "vColor");
	
	// specifies the vertex color attribute information (in an array), used
	// for rendering 
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

	// enable this attribute, with the given attribute name
    gl.enableVertexAttribArray(vColor);
    
    render();
};


function setEventHandlers() {	
	canvas.onmousedown = function(){
		++mouseDown;
		var x = event.clientX;
		var y = event.clientY;
		var ndc_x = -1.0 + 2.0 * x/canvas.width;
		var ndc_y =   1.0 - 2.0* y/canvas.height;
		document.getElementById("myTextArea").innerHTML = String.prototype.concat(String(x),',',String(y),'\n', String(ndc_x), ',', String(ndc_y));
	}
	canvas.onmouseup = function(){
		--mouseDown;
		document.getElementById("myTextArea").innerHTML = '';
	}
	canvas.onmousemove = function(){
		if (mouseDown == 1) {
		var x = event.clientX;
		var y = event.clientY;
		var ndc_x = -1.0 + 2.0 * x/canvas.width;
		var ndc_y =   1.0 - 2.0* y/canvas.height;
		document.getElementById("myTextArea").innerHTML = String.prototype.concat(String(x),',',String(y),'\n', String(ndc_x), ',', String(ndc_y));	
		}
	}
}

function displayToNDC (disp_coords) {

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

	switch (selection) {
		case 1:  // 2 triangles
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			break;
		case 2:  // triangle strip
			gl.drawArrays(gl.TRIANGLE_STRIP, 6, 4);
			break;
		case 3:  // triangle fan
			gl.drawArrays(gl.TRIANGLE_FAN, 10, 4);
			break;
		case 4:  // coord axes
			gl.drawArrays(gl.LINES, 14, 4);
			break;
	}
    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}
