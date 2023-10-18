function NNdataToCartesianData(NNarr) {
    let cartesianArr = []
    for (let i = 0; i < NNarr.length; i++) {
        cartesianArr.push(NNarr[i][0])
    }
    return cartesianArr
}

// [[{this.xs: [], this.ys: [], colour: []}]]

class CartesianPlane extends Base {
    constructor(width, height) {
        super(width, height)
        this.graphOpt;
        this.opt;
    }

    setGraphOpt(value) {
        this.graphOpt = value;
        return this;
    }

    setOpt(value) {
        this.opt = value;
        return this;
    }

    render(x, y) {
        this.x = x + this.width/2 ;
        this.y = y + this.height/2;
        
        push()
        noStroke()
        fill(this.graphOpt.background.colour)
        rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height,10)
        stroke(this.graphOpt.lines.colour)
        strokeWeight(this.graphOpt.lines.thickness)
        line(this.x- this.width/2, this.y, this.x + this.width/2, this.y)
        line(this.x, this.y - this.height/2, this.x, this.y + this.height/2)

        let scaleX;
        let scaleY;
        let largestX = -Infinity;
        let largestY = -Infinity;

        if (this.opt[0].scaleOfLargest == true) {
            for (let i = 1; i < this.opt.length; i++) {
                for (let j = 0; j < this.opt[i].xs.length; j++) {
                    let x = this.opt[i].xs[j][this.opt[i].xIndex]
                    let y = this.opt[i].ys[j][this.opt[i].yIndex]
                    if (Math.abs(x) > largestX){
                        largestX = Math.abs(x)
                    }
                    if (Math.abs(y) > largestY){
                        largestY = Math.abs(y)
                    }
                }
            }
        }
        else {
            for (let i = 1; i < this.opt.length; i++) {
                if(this.opt[i].scaleOfThis == true) {
                    for (let j = 0; j < this.opt[i].xs.length; j++) {
                        let x = this.opt[i].xs[j][this.opt[i].xIndex]
                        let y = this.opt[i].ys[j][this.opt[i].yIndex]
                        if (Math.abs(x) > largestX){
                            largestX = Math.abs(x)
                        }
                        if (Math.abs(y) > largestY){
                            largestY = Math.abs(y)
                        }
                    }
                }
            }
        }
        scaleX = this.width/2/largestX
        scaleY = this.height/2/largestY

        for (let i = 1; i < this.opt.length; i++) {
            for (let j = 0; j < this.opt[i].xs.length; j++) {
                stroke(this.opt[i].colour)
                let x = this.opt[i].xs[j][this.opt[i].xIndex]
                let y = this.opt[i].ys[j][this.opt[i].yIndex]
                line(x * scaleX + this.x + this.opt[i].crossSize, - y * scaleY + this.y + this.opt[i].crossSize, x * scaleX + this.x - this.opt[i].crossSize, - y * scaleY + this.y - this.opt[i].crossSize)
                line(x * scaleX + this.x - this.opt[i].crossSize, - y * scaleY + this.y + this.opt[i].crossSize, x * scaleX + this.x + this.opt[i].crossSize, - y * scaleY + this.y - this.opt[i].crossSize)
            }
        }

        pop()
    }
}