class Sphere extends Model{
    create(){
        this.original.verts=[];

        let radius = 10;
        let numLatitudeLines = 10;
        let numLongitudeLines = 10;

        let numVertices = numLatitudeLines * (numLongitudeLines + 1) + 2

        let positions = []
        let texcoords = []

        // North pole.
        positions[0] = {x:0, y:radius, z:0}
        texcoords[0] = {x:0, y:1}

        // South pole.
        positions[numVertices - 1] = {x:0, y:-radius, z:0}
        texcoords[numVertices - 1] = {x:0, y:0}

        // +1.0f because there's a gap between the poles and the first parallel.
        let latitudeSpacing = 1.0 / (numLatitudeLines + 1.0)
        let longitudeSpacing = 1.0 / (numLongitudeLines)

        // start writing new vertices at position 1
        let v = 1
        for(let latitude = 0; latitude < numLatitudeLines; latitude++) {
            for(let longitude = 0; longitude <= numLongitudeLines; longitude++) {

                // Scale coordinates into the 0...1 texture coordinate range,
                // with north at the top (y = 1).
                texcoords[v] = {
                    x:longitude * longitudeSpacing,
                    y:1.0 - (latitude + 1) * latitudeSpacing                            
                }

                // Convert to spherical coordinates:
                // theta is a longitude angle (around the equator) in radians.
                // phi is a latitude angle (north or south of the equator).
                let theta = texcoords[v].x * 2.0 * Math.PI
                let phi = (texcoords[v].y - 0.5) * Math.PI

                // This determines the radius of the ring of this line of latitude.
                // It's widest at the equator, and narrows as phi increases/decreases.
                let c = Math.cos(phi)

                // Usual formula for a vector in spherical coordinates.
                // You can exchange x & z to wind the opposite way around the sphere.
                positions[v] = {
                    x:(c * Math.cos(theta))* radius,
                    y:(Math.sin(phi))* radius,
                    z:(c * Math.sin(theta))* radius
                }           

                // Proceed to the next vertex.
                v++
            }
        }
        this.original.verts = positions.map(vert=>{return {...vert}})
    }
}