let previousCosts1 = Array(501).fill(0)
// let previousCosts2 = Array(10001).fill(0)
let costGraphXVal = [...Array(previousCosts1.length).keys()]

let brainRender1 = new BrainRender(brain1, innerWidth/1.3, innerHeight/3, 10, 5)
// let brainRender2 = new BrainRender(brain2, 1000, 500, 10, 10)

let filename1 = ""
let uploadData = ""


let p = new p5()
let scrollView1 = new ScrollView()
let scrollView2 = new ScrollView()
let downloadTextInput = new TextInput("").bind("filename1")
let uploadTextInput = new TextInput("").bind("uploadData")

let lineGraph1 = new LineGraph()
    .addLine({
        bindingX: "costGraphXVal",
        bindingY: "previousCosts1",
        fill: Color.pink.concat(50),
        lineColour: Color.pink,
        dotWeight: 0,
        // dotColour: Color.nudge(Color.blue, 2)
    }, "Testing")
    .config({
        domainSize: 10,
        rangePrecision: 100000,
    })
    .setWidth(brainRender1.width/2)
    .setHeight(400)
    .textSize(12)
    .background(Color.purple.concat(20))

let cartesianPlane1 = new CartesianPlane (lineGraph1.width/2, lineGraph1.height/2 - 7.5)
    .setGraphOpt(
        {
            background: {colour: Color.purple.concat(30)},
            lines: {
                colour: Color.secondary,
                thickness: 1,
            }
        }
    )
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

let cartesianPlane2 = new CartesianPlane(lineGraph1.width/2, lineGraph1.height/2 - 7.5)
    .setGraphOpt(
        {
            background: {colour: Color.purple.concat(30)},
            lines: {
                colour: Color.secondary,
                thickness: 1,
            }
        }
    )
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
                crossSize: 6
            },
            {
                xs: setOfInputs,
                ys: brain1.predictSet(setOfInputs),
                xIndex: 0,
                yIndex: 1,
                colour: Color.saffron,
                crossSize: 4
            },
        ]
    )

    let panel1 = new Panel().contains([
        new Title("Convolutional Neural Network").align("center").textColour(Color.pink.concat(200)).textSize(innerWidth/64),
        brainRender1,
        new HStack().contains([
            lineGraph1,
            new VStack().contains([
                new HStack().contains([
                    cartesianPlane1,
                    cartesianPlane2,
                ]),
                new HStack().contains([
                    new Panel().contains([
                        new Label("Upload Neural Network:").textColour(Color.pink.concat(190)).textSize(innerWidth/140),
                        new HStack().contains([
                            scrollView2.contains(
                                uploadTextInput
                                    .textColour(Color.red)
                                    .textSize(innerWidth/170.666)
                                    .background(Color.purple.concat(10))
                                    .minWidth(lineGraph1.width/2- lineGraph1.width/6)
                                    
                                    .placeholder("uploadData")
                                    .paddingFactor(0.5)
                            ).setWidth(lineGraph1.width/2- lineGraph1.width/6),
                            
                            new Button()
                                .command(() => {
                                    uploadData = uploadTextInput.t
                                    brain1.upload(JSON.parse(uploadData))
                                    uploadData = ""
                                    uploadTextInput.t = ""
                                })
                                .background(Color.green)
                                .contains(new Icon(UPLOAD_SVG))
                                .setWidth(innerWidth/85.333)
                                .setHeight(innerWidth/85.333)
                                .paddingFactor(0.5)
                                .align('center'),
                        ]),
                        new Blank(0,8),
                        new Label("Download Neural Network:").textColour(Color.pink.concat(190)).textSize(innerWidth/140),
                        new HStack().contains([
                            scrollView1.contains(
                                downloadTextInput
                                    .textColour(Color.red)
                                    .textSize(innerWidth/170.666)
                                    .background(Color.purple.concat(10))
                                    .minWidth(lineGraph1.width/2- lineGraph1.width/6)
                                    
                                    .placeholder("Filename")
                                    .paddingFactor(0.5)
                            ).setWidth(lineGraph1.width/2- lineGraph1.width/6),
                            
                            new Button()
                                .command(() => {
                                    filename1 = downloadTextInput.t
                                    brain1.download(filename1)
                                    filename1 = ""
                                    downloadTextInput.t = ""
                                })
                                .background(Color.green)
                                .contains(new Icon(DOWNLOAD_SVG))
                                .setWidth(innerWidth/85.333)
                                .setHeight(innerWidth/85.333)
                                .paddingFactor(0.5)
                                .align('center'),
                        ])

                        
                    ])
                    .minWidth(lineGraph1.width/2)
                    .minHeight(lineGraph1.height/2-innerWidth/170.666)
                    .background(Color.purple.concat(20))
                    .cornerRadius(10),
                    new Block(lineGraph1.width/2, lineGraph1.height/2).background(Color.purple.concat(20)),
                ]),
            ]),
        ])
        
    ])
    .spacing(50)
    .padding(35)
    .cornerRadius(10)

    


    
    let hstack = new HStack().contains([
        panel1
    ])
    .centered(true)
    .spacing(100)