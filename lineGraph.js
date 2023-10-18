class LineGraph {
    constructor(width=200, height=150) {
        this.x;
        this.y;
        this.width = width;
        this.height = height;
        this.pad = 0;

        this.clickable = false;
        this.typeable = false;
        this.scrollable = false;

        this.alignment = "leading";
        this.centeredVar = false;

        this.hiddenVar = false;
        this.phantomVar = false;

        this.lines = {
            
        }

        this.configVar = {
            minX: 0,
            minY: 0,
            domainSize: 4,
            rangeSize: 4,
            domainPrecision: 100,
            rangePrecision: 100,
        }

        this.spaceAroundGraph = 10;

        this.backgroundVar = Color.nearInverse;
        this.borderVar = Color.transparent;
        this.borderWeightVar = 1;
        this.cornerRadiusVar = [10, 10, 10, 10]

        this.textColourVar = Color.primary;
        this.textSizeVar = 6;

        this.popupID = "";
        this.canSelect = true;
    }

    background(colour) {
        this.backgroundVar = colour;
        return this;
    }
    border(colour) {
        this.borderVar = colour;
        return this;
    }
    borderWeight(value) {
        this.borderWeightVar = value;
        return this;
    }
    cornerRadius(tl=10, tr, br, bl) {
        if (tr == undefined && br == undefined && bl == undefined) {
            // r1 applies to all corners
            this.cornerRadiusVar = [tl, tl, tl, tl];
        }
        else {
            // each one individually applies to their own corner with tl as top-left and tr as top-right etc
            this.cornerRadiusVar = [tl ?? 0, tr ?? 0, br ?? 0, bl ?? 0];
        }
        return this;
    }
    textColour(colour) {
        this.textColourVar = colour;
        return this;
    }
    textSize(value) {
        this.textSizeVar = value;
        return this;
    }
 
    addLine(value, name) {
        let boiler = {
            bindingX: "",
            bindingY: "",
            valueX: [],
            valueY: [],
            minXI: 0,
            joinStart: true,
            joinEnd: true,
            lineColour: Color.secondary,
            lineWeight: 1,
            dotColour: Color.secondary,
            dotWeight: 4,
            fill: Color.red.concat(140),
            maxX: 0,
            maxY: 0,
        }
        for (const key of Object.keys(value)) {
            boiler[key] = value[key];
        }
        this.lines[name] = boiler;
        return this;
    }

    pipe(popupID, canSelect) {
        if (popupID !== undefined) this.popupID = popupID;
        if (canSelect !== undefined) this.canSelect = canSelect;
        if (this.contents[this.displayState]) if (this.contents[this.displayState].clickable) this.contents[this.displayState].pipe(popupID, canSelect)
    }

    render(x, y, context, contextX, contextY) {
        if (this.centeredVar) {
            if (x !== undefined) this.x = x-this.width/2;
            if (y !== undefined) this.y = y-this.height/2;
        }
        else {
            if (x !== undefined) this.x = x;
            if (y !== undefined) this.y = y;
        }

        if (this.hiddenVar == false) {
            this.configVar.maxX = Math.max(...Object.values(this.lines).map(o => Math.max(...o.valueX)));
            this.configVar.maxY = Math.max(...Object.values(this.lines).map(o => Math.max(...o.valueY)));
            
            let scaleX = (this.width-2*this.spaceAroundGraph)/(this.configVar.maxX-this.configVar.minX)
            let scaleY = (this.height-2*this.spaceAroundGraph)/(this.configVar.maxY-this.configVar.minY)

            
            fill(this.backgroundVar)
            stroke(this.borderVar)
            strokeWeight(this.borderWeightVar)
            rect(this.x, this.y, this.width, this.height, this.cornerRadiusVar[0], this.cornerRadiusVar[1], this.cornerRadiusVar[2], this.cornerRadiusVar[3])
            
            // fill(Color.purple)
            // rect(this.x + this.spaceAroundGraph, this.y + this.spaceAroundGraph, this.width - 2*this.spaceAroundGraph, this.height - 2*this.spaceAroundGraph)
            
            for (const key of Object.keys(this.lines)) {
                let line = this.lines[key]
                
                if (line.bindingX != "") {
                    line.valueX = eval(line.bindingX)
                    for (let i = 0; i < line.valueX.length; i++) {
                        if (line.valueX[i] >= this.configVar.minX) {
                            line.minXI = i;
                            break;
                        }
                    }
                }
                if (line.bindingY != "") line.valueY = eval(line.bindingY)
                
                push()
                fill(line.fill)
                strokeJoin(ROUND)
                beginShape()
                if (line.joinStart) vertex(this.x + this.spaceAroundGraph + (line.valueX[line.minXI]-this.configVar.minX)*scaleX, this.y + this.height - this.spaceAroundGraph)

                for (let n = line.minXI; n < line.valueX.length; n++) {
                    let X = line.valueX[n]
                    let Y = line.valueY[n]
                    vertex(this.x + this.spaceAroundGraph + (X-this.configVar.minX)*scaleX, this.y + this.height - this.spaceAroundGraph - (Y-this.configVar.minY)*scaleY)
                }
                if (line.joinEnd) vertex(this.x + this.spaceAroundGraph + (line.valueX.at(-1)-this.configVar.minX)*scaleX, this.y + this.height - this.spaceAroundGraph)
                endShape()

                noFill()
                stroke(line.lineColour)
                strokeWeight(line.lineWeight)
                beginShape()
                for (let n = line.minXI; n < line.valueX.length; n++) {
                    let X = line.valueX[n]
                    let Y = line.valueY[n]
                    vertex(this.x + this.spaceAroundGraph + (X-this.configVar.minX)*scaleX, this.y + this.height - this.spaceAroundGraph - (Y-this.configVar.minY)*scaleY)
                }
                endShape()

                stroke(line.dotColour)
                strokeWeight(line.dotWeight)
                beginShape()
                for (let n = line.minXI; n < line.valueX.length; n++) {
                    let X = line.valueX[n]
                    let Y = line.valueY[n]
                    point(this.x + this.spaceAroundGraph + (X-this.configVar.minX)*scaleX, this.y + this.height - this.spaceAroundGraph - (Y-this.configVar.minY)*scaleY)
                }
                endShape()
                pop()
            }

            push()
            noStroke()
            fill(this.textColourVar)
            textSize(this.textSizeVar)
            textAlign(CENTER, CENTER)

            for (let n = 0; n <= (this.configVar.maxX-this.configVar.minX)*scaleX+1; n+=(this.configVar.maxX-this.configVar.minX)*scaleX/this.configVar.domainSize) {
                text(Math.round((n/scaleX+this.configVar.minX)*this.configVar.domainPrecision)/this.configVar.domainPrecision, this.x + this.spaceAroundGraph + n, this.y + this.height - this.spaceAroundGraph/2)
            }
            for (let n = 0; n <= (this.configVar.maxY-this.configVar.minY)*scaleY+1; n+=(this.configVar.maxY-this.configVar.minY)*scaleY/this.configVar.rangeSize) {
                let t = Math.round((n/scaleY+this.configVar.minY)*this.configVar.rangePrecision)/this.configVar.rangePrecision;
                text(t, this.x + this.spaceAroundGraph/2, this.y + this.height - this.spaceAroundGraph - n)
                if (this.spaceAroundGraph < textWidth(`${t}`)*1.4) this.spaceAroundGraph = textWidth(`${t}`)*1.4;
            }
            pop()
        }
    }

    // Expects input sorted in acending order
    setX(value, lineName) {
        this.lines[lineName].valueX = value;
        for (let i = 0; i < this.lines[lineName].valueX.length; i++) {
            if (this.lines[lineName].valueX[i] >= this.lines[lineName].minX) {
                this.lines[lineName].minXI = i;
                break;
            }
        }
        // if (this.bindingX != "") eval(`${this.bindingX} = this.valueX`)
        return this;
    }
    setY(value, lineName) {
        this.lines[lineName].valueX = value;
        for (let i = 0; i < this.lines[lineName].valueX.length; i++) {
            if (this.lines[lineName].valueX[i] >= this.lines[lineName].minX) {
                this.lines[lineName].minXI = i;
                break;
            }
        }
        // if (this.bindingY != "") eval(`${this.bindingY} = this.valueY`)
        return this;
    }

    config(obj) {
        for (const key of Object.keys(obj)) {
            this.configVar[key] = obj[key];
        }
        return this;
    }

    padding(value) {
        this.pad = value;
        return this;
    }

    align(value) {
        if (value == "leading" || value == "center" || value == "trailing") {
            this.alignment = value;
        }
        else {
            logCanvasUIError(`Invalid alignment: '${value}'. Ensure alignment is either 'leading', 'center', or 'trailing'.`)   
        }
        return this;
    }

    hidden(value=true) {
        this.hiddenVar = value;
        return this;
    }
    phantom(value=true) {
        this.phantomVar = value;
        return this;
    }

    centered(value=true) {
        this.centeredVar = value;
        return this;
    }

    mouseOver() {
        if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) return true;
        return false;
    }

    setWidth(value) {
        this.width = value;
        return this;
    }

    setHeight(value) {
        this.height = value;
        return this;
    }
}