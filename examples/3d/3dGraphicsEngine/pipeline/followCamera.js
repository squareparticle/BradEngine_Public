class FollowCamera extends Camera {

    runCameraControls(delta){
        this.pos.x = -this.follow.pos.x + this.dist.x;
        this.pos.y = -(this.follow.pos.y + this.dist.y);
        this.pos.z = -this.follow.pos.z + this.dist.z;

        //console.log(this.pos);
    }
}