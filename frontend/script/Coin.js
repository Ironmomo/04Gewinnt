export class Coin {
    constructor(color,isNew) {
        this.color = color
        this.position = {x:0,y:0}
        this.currentPosition = {x:0, y:0}
        this.velocityY = 1
        this.isNew = isNew
    }

    setPositionRelativToParent(parentDiv) {
        this.position.x = parentDiv.offsetLeft + parentDiv.offsetWidth/2
        this.position.y = parentDiv.offsetTop + parentDiv.offsetHeight/2
        this.currentPosition.x = this.position.x
        if(!this.isNew) {
            this.currentPosition.y = this.position.y
        }
    }

    updateCurrentPosition() {
        if(this.currentPosition.y + this.velocityY <= this.position.y) {
            this.currentPosition.y = this.currentPosition.y + this.velocityY
            this.velocityY = this.velocityY + 0.5
        } else {
            this.currentPosition.y = this.position.y
            this.isNew = false
        }
    }
}