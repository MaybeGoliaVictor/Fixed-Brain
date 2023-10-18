


let brain1 = new Brain([2,4, 2], "Leaky ReLU", "Sigmoid", "Mean Squared Error", 0.4)
    .initStructure(/*"Dense"*/
        [
            () => {
                let arr = []
                arr.push([0])
                arr.push([0,1])
                arr.push([0,1])
                arr.push([1])
                return arr
            },
            () => {
                let arr = []
                arr.push([0,1,2])
                arr.push([1,2,3])
                return arr
            }
            
        ]
    )


// brain1.regularisation(0.0001)


const setOfInputs =  [[-3,1], [-2,0], [-1,1], [0,0], [1,1], [2,0], [3,1]]
const setOfOutputs = [[0,1], [1,0] , [0,1], [1,0], [0,1], [1,0], [0,1]]

let sizeI1 = 0
let sizeI2 = 0
let sizeO = []

for (let i = 0; i < setOfInputs.length; i++) {
    sizeI1 += Math.abs(setOfInputs[i][0]);
    sizeI2 += Math.abs(setOfInputs[i][1]);
}

for (let i = 0; i < setOfInputs.length; i++) {
    setOfInputs[i][0] /= sizeI1;
    setOfInputs[i][1] /= sizeI2;
}


// setOfInputs, sizeI = brain1.normalise(setOfInputs)
// for (let i = 0; i < setOfInputs.length; i++) {
//     setOfInputs[i][1] *= sizeI[1]
// }
// setOfOutputs, sizeO = brain1.normalise(setOfOutputs)

function setup() {
    createCanvas(screen.width, screen.height)
    noLoop()
}

function draw() {
    cursor("default")
    setTimeout(redraw, 0);
    background(Color.black)
    brain1.gradientDescent(setOfInputs, setOfOutputs)

    logCost(previousCosts1, brain1.calculateCost(setOfInputs,setOfOutputs))

    cartesianPlane1
        .setOpt(
            [
                {
                    scaleOfLargest: true
                },
                {
                    xs: setOfInputs,
                    ys: setOfOutputs,
                    xIndex: 0,
                    yIndex: 0,
                    colour: Color.red,
                    scaleOfThis: false,
                    crossSize: innerWidth/341.333
                },
                {
                    xs: setOfInputs,
                    ys: brain1.predictSet(setOfInputs),
                    xIndex: 0,
                    yIndex: 0,
                    colour: Color.saffron,
                    crossSize: innerWidth/512
                },
            ]
        )
    
    cartesianPlane2
        .setOpt(
            [
                {
                    scaleOfLargest: true
                },
                {
                    xs: setOfInputs,
                    ys: setOfOutputs,
                    xIndex: 0,
                    yIndex: 1,
                    colour: Color.red,
                    scaleOfThis: false,
                    crossSize: innerWidth/341.333
                },
                {
                    xs: setOfInputs,
                    ys: brain1.predictSet(setOfInputs),
                    xIndex: 0,
                    yIndex: 1,
                    colour: Color.saffron,
                    crossSize: innerWidth/512
                },
            ]
        )

    hstack.render(innerWidth/2,innerHeight/2) 
    scrollView1.set({x:scrollView1.width-scrollView1.contents.width, y:0})
    scrollView2.set({x:scrollView2.width-scrollView2.contents.width, y:0})
//    _draw()
}

function logCost(arr, cost){
    arr.shift()
    arr.push(cost)
}


function mousePressed() {
    hstack.onMousePressed()
}

function mouseReleased() {
    hstack.onMouseReleased()
}

function keyPressed() {
    hstack.onKeyPressed()
    
}

function mouseWheel(e){
    hstack.onMouseWheel(e)
}
