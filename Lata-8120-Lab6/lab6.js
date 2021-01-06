
// some globals
var gl;
var canvas
var up = 1;
var x = -1;
var y = -1;
var transdir = 0;
var colorLoc, M_Loc, scaleLoc, transLoc;
var delay = 100;
var vBuffer, cBuffer;
var program;
var vertices = [];
var Vertices = [];
var vertices2 = [];
var Vertices2 = [];
var vcolors = [];
var color_vals = [1.0, 0., 0., 1.0];
var i = 0;
var l;
var xform_mode = {
		Translate: 0,
		Rotate: 1,
		Scale: 2
	};
var inc = .1;
var selection = xform_mode.Rotate;
var wxmin
var wxmax
var wymin
var wymax
var vxmin = -1;
var vxmax = 1;
var vymin = -1;
var vymax = 1;
var Mwv = identity();
var wWidth 
var wHeight
var wXCenter
var wYCenter 
var xform
var down = false;
var textArea = document.getElementById("myTextArea");
var mouseDown = 0;
var box = 0;
var boxVertices = [];
var boxx;
var boxy;
var boxx2;
var boxy2;
var a = [];
var b = [];
var yMax;
var yMin;
var clip = 0;
var m;
var A; var AA; var B; var BB;
var Vs;

window.onload = function init() {
	// get the canvas handle from the document's DOM
	canvas = document.getElementById( "gl-canvas" );
	wxmin = document.getElementById( "xmin" ).value;
	wxmax = document.getElementById( "xmax" ).value;
	wymin = document.getElementById( "ymin" ).value;
	wymax = document.getElementById( "ymax" ).value;
	wxmin = -1;
	wxmax = 1;
	wymin = -1;
	wymax = 1;
	wWidth = wxmax - wxmin;
	wHeight = wymax - wymin;
	wXCenter = (wxmin + wxmax)/2;
	wYCenter = (wymin + wymax)/2;
    
	// initialize webgl
    gl = WebGLUtils.setupWebGL( canvas );

	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}
    //  Load shaders -- all work done in init_shaders.js
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

	// make this the current shader program
    gl.useProgram( program );

	// Get a handle to transform matrix  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
	M_Loc = gl.getUniformLocation( program, "M_Transform" );
	M_Loc2 = gl.getUniformLocation( program, "M_wv" );

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

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL)
	gl.depthMask(true);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.SCISSOR_TEST);
	gl.enable(gl.CULL_FACE);

    render();
};

function setEventHandlers() {

	document.getElementById("submit").onclick = function (event){
		console.log('hello');
		wxmin = document.getElementById( "xmin" ).value*1;
		wxmax = document.getElementById( "xmax" ).value*1;
		wymin = document.getElementById( "ymin" ).value*1;
		wymax = document.getElementById( "ymax" ).value*1;
		wWidth = wxmax - wxmin;
		wHeight = wymax - wymin;
		wXCenter = (wxmin + wxmax)/2;
		wYCenter = (wymin + wymax)/2;
		x = wxmin;
		y = wymin;
		transdir = 0;
		buildWindowMatrix();
	}
	canvas.onmousedown = function(){
		++mouseDown;
		x = event.clientX;
		y = event.clientY;
		ndc_x = -1.0 + 2.0 * x/(canvas.width/2);
		ndc_y =   1.0 - 2.0* y/canvas.height;
		document.getElementById("myTextArea").innerHTML = String.prototype.concat(String(x),',',String(y),'\n', String(ndc_x), ',', String(ndc_y));
		if(box == 0){
		vertices.push([ndc_x,ndc_y]);
		vertices.push([ndc_x,ndc_y]);
		l = vertices.length;
		}
		if(box == 1){
			boxVertices = []
			boxx = ndc_x;
			boxy = ndc_y;
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			boxVertices.push([ndc_x,ndc_y]);
			l = boxVertices.length;
		}
		updateVertices(Vertices);
	}
	canvas.onmouseup = function(){
		--mouseDown;
		x = event.clientX;
		y = event.clientY;
		ndc_x = -1.0 + 2.0 * x/(canvas.width/2);
		ndc_y =   1.0 - 2.0* y/canvas.height;
		//document.getElementById("myTextArea").innerHTML = '';
		if(box==0){
		vertices[l-1] = [ndc_x,ndc_y];
		}
		if(box==1){
		boxVertices[l-7] = [ndc_x,boxy];
		boxVertices[l-5] = [boxx,ndc_y];
		boxVertices[l-4] = [ndc_x,boxy];
		boxVertices[l-3] = [ndc_x,ndc_y];
		boxVertices[l-2] = [boxx,ndc_y];
		boxVertices[l-1] = [ndc_x,ndc_y];
		boxx2 = ndc_x;
		boxy2 = ndc_y;
		}
		Vertices = vertices.concat(boxVertices);
		updateVertices(Vertices);
	}
	canvas.onmousemove = function(){
		x = event.clientX;
		y = event.clientY;
		ndc_x = -1.0 + 2.0 * x/(canvas.width/2);
		ndc_y =   1.0 - 2.0* y/canvas.height;
		if (mouseDown == 1) {
				if(box==0){
		vertices[l-1] = [ndc_x,ndc_y];
		}
		if(box==1){
		boxVertices[l-7] = [ndc_x,boxy];
		boxVertices[l-5] = [boxx,ndc_y];
		boxVertices[l-4] = [ndc_x,boxy];
		boxVertices[l-3] = [ndc_x,ndc_y];
		boxVertices[l-2] = [boxx,ndc_y];
		boxVertices[l-1] = [ndc_x,ndc_y];
		boxx2 = ndc_x;
		boxy2 = ndc_y;
		}
		Vertices = vertices.concat(boxVertices);
		updateVertices(Vertices);
		}
		document.getElementById("myTextArea").innerHTML = String.prototype.concat(String(x),',',String(y),'\n', String(ndc_x), ',', String(ndc_y));
	}
	document.getElementById("clear").onclick = function(){
		Vertices = [];
		vertices = [];
		boxVertices = [];
	}
	document.getElementById("clip").onclick = function(){
		clip += 1;
	}
}
function buildWindowMatrix() {
	// get the world to ndc matrix location
	M_wrld_ndc_loc = gl.getUniformLocation(program, "M_wrld_to_ndc");

	// compute the transform
	M_wrld_ndc = worldToNDC (wc_min, wc_max);
	

	// share with shader
	gl.uniformMatrix4fv(M_wrld_ndc_loc, false, flatten(M_wrld_ndc));

}

function updateVertices(v) {

	// make the needed GL calls to tranfer vertices
	
	// bind the buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// transfer the data -- this is actually pretty inefficient!
	// flatten() function is defined in MV.js - this simply creates only
	// the vertex coordinate data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW);
	
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

	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
	// each
	updateVertices(Vertices);
	updateVariables();

	//Left Viewport
	gl.viewport(0, 0, canvas.width/2, canvas.height);
	gl.scissor(0, 0, canvas.width/2, canvas.height);
	gl.clearColor(1, 1, 0, .75);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
		
	gl.uniformMatrix4fv(M_Loc, false, flatten(identity()));
	gl.uniformMatrix4fv(M_Loc2, false, flatten(Mwv))

	// draw the square as a triangle strip
	gl.bufferData(gl.ARRAY_BUFFER, flatten(Vertices), gl.STATIC_DRAW);
	gl.drawArrays(gl.LINES, 0, Vertices.length);
	
	gl.viewport(512, 0, canvas.width/2, canvas.height);
	gl.scissor(512, 0, canvas.width/2, canvas.height);
	gl.clearColor(.5, 1, 1, 1);
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	Vertices2 = vertices;

	if(clip == 1) {
		Vertices2 = Clip(Vertices2);
		clip-=1;
	}

	updateVertices(Vertices2);
	updateVariables();

	gl.drawArrays(gl.LINES, 0, Vertices2.length);

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}

