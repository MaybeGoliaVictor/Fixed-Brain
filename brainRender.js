class BrainRender extends Base{
    constructor(brain, w, h) {
        super(w,h)
        this.brain = brain
        this.width = w
        this.height = h
        // this.weightNodeLimit = wNodeLimit
        // this.heightNodeLimit = hNodeLimit
    }

    render(x,y) {
        this.x = x
        this.y = y

        let widthBtwnNodes = this.width / (this.brain.shape.length-1) 

        let largest = 0
        for (let i = 0; i < this.brain.shape.length; i++) {
            if(largest < this.brain.shape[i]){
                largest = this.brain.shape[i]
            }
        }

        let heightBtwnNodes = 0

        if (largest != 1) {
            heightBtwnNodes = this.height / (largest-1) - 10*2/(largest-1)
        }

    //[ layer one - [ node one - {x: y: }, node two - {x: y: }, {x: y: }, ...], layer two - [{x: y: }, {x: y: }, {x: y: }, ...], ...]
        let nodeLocations = []

        push()
                for (let i = 0; i < this.brain.shape.length; i++) {
                    let initialHeight = (largest != 1) ? (this.height - this.height / (largest-1)*(this.brain.shape[i]-1))/2 + 10 : 0
    
                    
                    nodeLocations.push([])
                    for (let j = 0; j < this.brain.shape[i]; j++) {
    
                        //for y osscilation
                        let center = Math.abs((this.brain.shape[i]/2 + 0.5))
                        let distFromCenter = (j + 1-center) == 0 ? 1:(j + 1-center)
                        let osscilationFactorY = Math.sin((frameCount)/(50 * this.brain.shape[i]/Math.max(1, Math.abs(distFromCenter))))*(12-5/Math.abs(distFromCenter)) * Math.sign(distFromCenter)
                        
                        //for x osscilation
                        center = Math.abs(this.brain.shape.length/2 + 0.5)
                        distFromCenter = (i + 1-center) == 0 ? 1:(i + 1-center)
                        let osscilationFactorX = Math.sin((frameCount)/(50 * this.brain.shape.length/Math.max(1, Math.abs(distFromCenter))))*(12-5/Math.abs(distFromCenter)) * Math.sign(-distFromCenter)
    
                        if (i == 0){
                            //ellipse(x + i * widthBtwnNodes + 10 + osscilationFactorX, y + j * heightBtwnNodes + initialHeight + osscilationFactorY,10*2)
                            nodeLocations[i].push({'x': x + i * widthBtwnNodes + 10 + osscilationFactorX, 'y': y + j * heightBtwnNodes + initialHeight + osscilationFactorY})
                        }
                        else if (i == this.brain.shape.length-1) {
                            //ellipse(x + i * widthBtwnNodes - 10 + osscilationFactorX, y + j * heightBtwnNodes + initialHeight + osscilationFactorY,10*2)
                            nodeLocations[i].push({'x': x + i * widthBtwnNodes - 10 + osscilationFactorX, 'y': y + j * heightBtwnNodes + initialHeight + osscilationFactorY})
                        }
                        else {
                            //ellipse(x + i * widthBtwnNodes + osscilationFactorX, y + j * heightBtwnNodes + initialHeight + osscilationFactorY,10*2)
                            nodeLocations[i].push({'x': x + i * widthBtwnNodes + osscilationFactorX, 'y': y + j * heightBtwnNodes + initialHeight + osscilationFactorY})
                        }
                    }
                }
                
                //neural network internal background colour
                fill(Color.purple.concat(30));
                noStroke()
                beginShape();
                vertex(nodeLocations[0][0].x - 10, nodeLocations[0][0].y-10)
                for (let i = 1; i < nodeLocations.length-1; i++) {
                    vertex(nodeLocations[i][0].x, nodeLocations[i][0].y-10);
                    // let Y = nodeLocations[i+1][0].y - nodeLocations[i][0].y 
                    // let X = nodeLocations[i+1][0].x - nodeLocations[i][0].x
                    // let vecSize = Math.sqrt(Y**2 + X**2)
                    // Y /= vecSize
                    // X /= vecSize
                    // let xMoved = 0
                    // let yMoved = 0
                    // let signFlipper = -1
                    // while (true) {
                    //     xMoved += 30*X
                    //     yMoved += 30*Y
                    //     signFlipper *= -1
                    //     if (xMoved < nodeLocations[i+1][0].x - nodeLocations[i][0].x){
                    //         curveVertex(nodeLocations[i][0].x + xMoved - 10*Y * signFlipper, nodeLocations[i][0].y-10 + yMoved + 10*X * signFlipper)
                    //     }
                    //     else{
                    //         break
                    //     }
                    // }
                }
                vertex(nodeLocations.at(-1)[0].x + 10, nodeLocations.at(-1)[0].y-10)
                // vertex(nodeLocations.at(-1)[0].x, nodeLocations.at(-1)[0].y-10)
                vertex(nodeLocations.at(-1).at(-1).x + 10, nodeLocations.at(-1).at(-1).y+10)
                for (let i = nodeLocations.length-1; i > 0; i--) {
                    vertex(nodeLocations[i][nodeLocations[i].length-1].x, nodeLocations[i][nodeLocations[i].length-1].y + 10);
                
                    // let Y = nodeLocations[i-1][nodeLocations[i-1].length-1].y - nodeLocations[i][nodeLocations[i].length-1].y 
                    // let X = nodeLocations[i-1][nodeLocations[i-1].length-1].x - nodeLocations[i][nodeLocations[i].length-1].x
                    // let vecSize = Math.sqrt(Y**2 + X**2)
                    // Y /= vecSize
                    // X /= vecSize
                    // let xMoved = 0
                    // let yMoved = 0
                    // let signFlipper = -1
                    // let previousX = 0
                    // let previousY = 0
                    // while (true) {
                    //     xMoved += (120 + (frameCount/100)%100)*X
                    //     yMoved += (120 + (frameCount/100)%100)*Y
                    //     signFlipper *= -1
                    //     if (xMoved > nodeLocations[i-1][nodeLocations[i-1].length-1].x - nodeLocations[i][nodeLocations[i].length-1].x){
                    //         curveVertex(nodeLocations[i][nodeLocations[i].length-1].x + xMoved - 10*Y * signFlipper * Math.cos(frameCount/500) + Math.random() + previousX, nodeLocations[i][nodeLocations[i].length-1].y+10 + yMoved + 10*X * signFlipper * Math.sin(frameCount/500) + previousY)
                    //         previousX = 0
                    //         previousY = 0
                    //     }
                    //     else{
                    //         previousX = - 10*Y * signFlipper * Math.cos(frameCount/100)
                    //         previousY = yMoved + 10*X * signFlipper * Math.sin(frameCount/100)
                    //         break
                    //     }
                    // }
                }
                vertex(nodeLocations[0].at(-1).x-10, nodeLocations[0].at(-1).y+10)
                endShape(CLOSE);
    
            //drawing the lines between the nodes
                // for (let i = 1; i < nodeLocations.length; i++) {
                //     for (let j = 0; j < nodeLocations[i].length; j++) {
                //         for (let n = 0; n < nodeLocations[i-1].length; n++) {
    
                //             if (this.brain.weights[i-1][j][n] < 0){
                //                 stroke(Color.red.concat(-this.brain.weights[i-1][j][n] * 255/2))
                //                 strokeWeight(5 - this.brain.weights[i-1][j][n] * 3)
                //             }
                //             else{
                //                 stroke(Color.blue.concat(this.brain.weights[i-1][j][n] * 255/2))
                //                 strokeWeight(5 + this.brain.weights[i-1][j][n] * 3)
                //             }
    
                //             let angle = Math.PI/2-Math.atan2(nodeLocations[i-1][n].y - nodeLocations[i][j].y, nodeLocations[i-1][n].x - nodeLocations[i][j].x)
    
                //             line(nodeLocations[i][j].x+10*Math.sin(angle)*2, nodeLocations[i][j].y+10*2*Math.cos(angle), nodeLocations[i-1][n].x-10*Math.sin(angle)*2, nodeLocations[i-1][n].y-10*2*Math.cos(angle))
                //         }
                            
                //     }
                // }

                // for (let layer = 1; layer < this.brain.connections.length; layer++) {
                //     for (let n1 = 0; n1 < this.brain.connections[layer].length; n1++) {
                //         for (let n2 = 0; n2 < this.brain.connections[layer-1].length; n2++) {
                //             if (this.brain.weights[layer-1][n1][n2] < 0){
                //                                 stroke(Color.red.concat(-this.brain.weights[layer-1][n1][n2] * 255/2))
                //                                 strokeWeight(5 - this.brain.weights[layer-1][n1][n2] * 3)
                //                             }
                //                             else{
                //                                 stroke(Color.blue.concat(this.brain.weights[layer-1][n1][n2] * 255/2))
                //                                 strokeWeight(5 + this.brain.weights[layer-1][n1][n2] * 3)
                //                             }
                    
                //                             let angle = Math.PI/2-Math.atan2(nodeLocations[layer-1][n2].y - nodeLocations[layer][n1].y, nodeLocations[layer-1][n2].x - nodeLocations[layer][n1].x)
                    
                //                             line(nodeLocations[layer][n1].x+10*Math.sin(angle)*2, nodeLocations[layer][n1].y+10*2*Math.cos(angle), nodeLocations[layer-1][n2].x-10*Math.sin(angle)*2, nodeLocations[layer-1][n2].y-10*2*Math.cos(angle))
                //         }
                //     }
                // }
    
                for (let layer = 1; layer < this.brain.connections.length+1; layer++) {
                    for (let node = 0; node < this.brain.connections[layer-1].length; node++) {
                        for (let weight = 0; weight < this.brain.connections[layer-1][node].length; weight++) {
                            if (this.brain.weights[layer-1][node][weight] < 0){
                                stroke(Color.red.concat(-this.brain.weights[layer-1][node][weight] * 255/2))
                                strokeWeight(5 - this.brain.weights[layer-1][node][weight] * 3)
                            }
                            else{
                                stroke(Color.blue.concat(this.brain.weights[layer-1][node][weight] * 255/2))
                                strokeWeight(5 + this.brain.weights[layer-1][node][weight] * 3)
                            }
        
                                let angle = Math.PI/2-Math.atan2(nodeLocations[layer-1][this.brain.connections[layer-1][node][weight]].y - nodeLocations[layer][node].y, nodeLocations[layer-1][this.brain.connections[layer-1][node][weight]].x - nodeLocations[layer][node].x)
        
                                line(nodeLocations[layer][node].x+10*Math.sin(angle)*2, nodeLocations[layer][node].y+10*2*Math.cos(angle), nodeLocations[layer-1][this.brain.connections[layer-1][node][weight]].x-10*Math.sin(angle)*2, nodeLocations[layer-1][this.brain.connections[layer-1][node][weight]].y-10*2*Math.cos(angle))
                        }
                    }
                }

                noStroke()
                fill(Color.white)
    
                for (let i = 0; i < nodeLocations[0].length; i++) {
                    ellipse(nodeLocations[0][i].x, nodeLocations[0][i].y, 10*2)
                }
    
                for (let i = 1; i < nodeLocations.length; i++) {
                    for (let j = 0; j < nodeLocations[i].length; j++) {
                        if(i != 0) {
                            if(this.brain.biases[i - 1][j] < 0) {
                                fill(Color.red.concat(80 - this.brain.biases[i - 1][j] * 205))
                            }
                            else {
                                fill(Color.blue.concat(80 + this.brain.biases[i - 1][j] * 205))
                            }
                            ellipse(nodeLocations[i][j].x, nodeLocations[i][j].y, 10*2 + Math.abs(this.brain.biases[i - 1][j]) * 10)
                        }
                    }
                }
            pop()
    }
}