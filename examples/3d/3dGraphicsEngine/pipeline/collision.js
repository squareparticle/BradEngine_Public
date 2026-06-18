class PolyCollsion{

    EPSILON = 0.000001;
    edge1 = [0,0,0];
    edge2 = [0,0,0];
    tvec = [0,0,0];
    pvec = [0,0,0];
    qvec = [0,0,0];

    dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }
    sub(out, a, b) {
        return this.subtract(out, a, b)
    }
    subtract(out, a, b) {
        out[0] = a[0] - b[0]
        out[1] = a[1] - b[1]
        out[2] = a[2] - b[2]
        return out
    }
    cross(out, a, b) {
        var ax = a[0], ay = a[1], az = a[2],
            bx = b[0], by = b[1], bz = b[2]

        out[0] = ay * bz - az * by
        out[1] = az * bx - ax * bz
        out[2] = ax * by - ay * bx
        return out
    }
    intersectTriangle (out, pt, dir, tri) {
        this.sub(this.edge1, tri[1], tri[0]);
        this.sub(this.edge2, tri[2], tri[0]);
        
        this.cross(this.pvec, dir, this.edge2);
        var det = this.dot(this.edge1, this.pvec);
        
        if (det < this.EPSILON) return null;
        this.sub(this.tvec, pt, tri[0]);
        var u = this.dot(this.tvec, this.pvec);
        if (u < 0 || u > det) return null;
        this.cross(this.qvec, this.tvec, this.edge1);
        var v = this.dot(dir, this.qvec);
        if (v < 0 || u + v > det) return null;
        
        var t = this.dot(this.edge2, this.qvec) / det;
        out[0] = pt[0] + t * dir[0];
        out[1] = pt[1] + t * dir[1];
        out[2] = pt[2] + t * dir[2];
        return out;
    }

    // let hitVerts = collision.getCollisionLoc(polyToTest,vertToCollideWith,vertDirection,length);

    getCollisionLoc(polyToTest,vertToCollideWith,vertDirection,length){
        // let tri = [[5,5,5],[10,15,4],[15,5,3]];
        // let pt = [9,5,-5];
        // let dir = [0.1,0.1,0.8];

        let tri = [
            [polyToTest[0].x,polyToTest[0].y,polyToTest[0].z],
            [polyToTest[1].x,polyToTest[1].y,polyToTest[1].z],
            [polyToTest[2].x,polyToTest[2].y,polyToTest[2].z]
        ];
        let pt = [vertToCollideWith.x,vertToCollideWith.y,vertToCollideWith.z];
        let dir = [vertDirection.x,vertDirection.y,vertDirection.z];

        let result = this.intersectTriangle([], pt, dir, tri);
        if(result!==null)
            return {x:result[0],y:result[1],z:result[2]};
        else
            return {x:0,y:0,z:0};
    }
}