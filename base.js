class Base {
    constructor(width=0, height=0) {
        this.x;
        this.y;
        this.width = width;
        this.height = height;

        this.clickable = false;
        this.typeable = false;
        this.scrollable = false;
        this.alignment = "center";
        this.hiddenVar = false;
        this.phantomVar = false;

        this.centeredVar = false;
        this.lockedVar = false;

        this.popupID = "";
        this.canSelect = true;
    }

    pipe(popupID, canSelect) {
        if (popupID !== undefined) this.popupID = popupID;
        if (canSelect !== undefined) this.canSelect = canSelect;
        if (this.contents) if (this.contents[this.displayState]) if (this.contents[this.displayState].clickable) this.contents[this.displayState].pipe(popupID, canSelect)
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
            if (context) {

            }
            else {
                
            }
        }
    }

    setWidth(value) {
        this.width = value;
        return this;
    }
    setHeight(value) {
        this.height = value;
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

}