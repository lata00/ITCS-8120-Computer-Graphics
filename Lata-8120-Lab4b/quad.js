function quad(a, b, c, d) 
{
    var indices = [a, b, c, a, c, d];
    for ( var i = 0; i<indices.length; ++i){
        points.push(vertices[indices[i]]);
        color_vals.push(vertexColors[indices[i]]);
    }
}