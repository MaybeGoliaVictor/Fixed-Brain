class Brain {
    constructor(shape, activationFunction, outputActivationFunction, costFunction, learningRate) {
        this.activationFunction = activationFunction
        this.outputActivationFunction = outputActivationFunction
        this.costFunction = costFunction
        this.shape = shape
        
        this.layers = []
        for (let i = 0; i < this.shape.length; i++) {
            this.layers.push(new Array(this.shape[i]))
            for (let j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j] = {rawValue: 0, activationValue: 0, finalValue: 0}
            }
        }

        this.biases = []
        for (let i = 1; i  < this.shape.length; i ++) {
            this.biases.push(new Array(this.shape[i]).fill(Math.random()))
        }

        this.learningRate = learningRate
        this.regularisationTerm = 0
    }

    initStructure(lambdaFunctions = "Dense") {
        this.connections = []
        this.weights = []
        if (lambdaFunctions == "Dense") {
            for (let layer = 1; layer < this.shape.length; layer++) {
                this.connections.push([])
                this.weights.push([])
                for (let node = 0; node < this.shape[layer]; node++) {
                    this.connections[layer-1].push([...Array(this.shape[layer-1]).keys()])
                    this.weights[layer-1].push(new Array(this.shape[layer-1]).fill(0).map(() => Math.random()))
                }
            }
        }
        else {
            for (let i = 0; i < lambdaFunctions.length; i++) {
                this.connections.push(lambdaFunctions[i]())
            }
            
            for (let layer = 0; layer < this.connections.length; layer++) {
                this.weights.push([])
                for (let node = 0; node < this.connections[layer].length; node++) {
                    this.weights[layer].push([])
                    for (let weight = 0; weight < this.connections[layer][node].length; weight++) {
                        this.weights[layer][node].push(Math.random())
                    }
                }
            }
        }

        this.resetUpdateGradients()

        return this
    }

    fwdPropagation(inputs) {

        //put the inputs in
        for (let node = 0; node < this.layers[0].length; node++) {
            this.layers[0][node].finalValue = inputs[node]
        }

        for (let layer = 0; layer < this.connections.length; layer++) {
            for (let node = 0; node < this.connections[layer].length; node++) {
                let sum = 0
                for (let weight = 0; weight < this.connections[layer][node].length; weight++) {
                    sum += this.layers[layer][this.connections[layer][node][weight]].finalValue * this.weights[layer][node][weight]
                }
                this.layers[layer+1][node].rawValue = sum + this.biases[layer][node]
                this.layers[layer+1][node].finalValue = sum + this.biases[layer][node]
                if (layer + 1 != this.connections.length) {
                    let neuron = this.layers[layer+1][node]
                    neuron.activationValue = activationFunctions[this.activationFunction](neuron.finalValue)
                    neuron.finalValue = neuron.activationValue
                }
            }
        }

        let outputs = []
        for (let node = 0; node < this.layers[this.layers.length-1].length; node++) {
            this.layers[this.layers.length-1][node].activationValue = activationFunctions[this.outputActivationFunction](this.layers[this.layers.length-1][node].rawValue,this.layers[this.layers.length-1])
            this.layers[this.layers.length-1][node].finalValue = this.layers[this.layers.length-1][node].activationValue
            outputs.push(this.layers[this.layers.length-1][node].activationValue)
        }

        return outputs
    }

    backPropagation(inputs, expectedOutputs) {
        let nodeValues = new Array(expectedOutputs.length)
        let outputs = this.fwdPropagation(inputs)

        //calculate nodeValues for output layer
        for (let node = 0; node < nodeValues.length; node++) {
            let costDerivative = costFunctionDerivatives[this.costFunction](outputs[node], expectedOutputs[node])
            let activationDerivative = activationDerivatives[this.outputActivationFunction](this.layers[this.layers.length-1][node].finalValue, this.layers[this.layers.length-1])
            nodeValues[node] = activationDerivative * costDerivative
        }

        //calculate gradients for all weights leading directly to the output layer
        for (let node = 0; node < nodeValues.length; node++) {
            for (let weight = 0; weight < this.connections[this.connections.length-1][node].length; weight++) {
                let derivativeCostOnWeight = this.layers[this.layers.length-2][this.connections[this.connections.length-1][node][weight]].finalValue * nodeValues[node]
                this.gradientsW[this.gradientsW.length-1][node][weight] += derivativeCostOnWeight + this.regularisationTerm * this.weights[this.weights.length-1][node][weight]
            }
            this.gradientsB[this.gradientsB.length-1][node] += nodeValues[node]
        }


        for (let layer = this.connections.length-1; layer > 0; layer--) {
            let newNodeValues = new Array(this.shape[layer])
            let sum = new Array(newNodeValues.length).fill(0)

            for (let node = 0; node < this.connections[layer].length; node++) {
                for (let weight = 0; weight < this.connections[layer][node].length; weight++) {
                    sum[this.connections[layer][node][weight]] += this.weights[layer][node][weight] * nodeValues[node]   
                }
            }
            for (let node = 0; node < newNodeValues.length; node++) {
                newNodeValues[node] = sum[node] * activationDerivatives[this.activationFunction](this.layers[layer][node].finalValue)
            }

            nodeValues = newNodeValues

            for (let node = 0; node < nodeValues.length; node++) {
                for (let weight = 0; weight < this.connections[layer-1][node].length; weight++) {
                    let derivativeCostOnWeight = this.layers[layer-1][this.connections[layer-1][node][weight]].finalValue * nodeValues[node]
                    this.gradientsW[layer-1][node][weight] += derivativeCostOnWeight + this.regularisationTerm * this.weights[layer-1][node][weight]

                }
                this.gradientsB[layer-1][node] += nodeValues[node]
            }
        }
    }

    gradientDescent(setOfInputs, setOfExpectedOutputs) {

        this.resetUpdateGradients()

        for (let i = 0; i < setOfInputs.length; i++) {
            this.backPropagation(setOfInputs[i], setOfExpectedOutputs[i])
        }

        for (let layer = 0; layer < this.weights.length; layer++) {
            for (let node = 0; node < this.weights[layer].length; node++) {
                for (let weight = 0; weight < this.weights[layer][node].length; weight++) {
                    this.weights[layer][node][weight] -= this.learningRate * this.gradientsW[layer][node][weight]/setOfInputs.length
                }
                this.biases[layer][node] -= this.learningRate * this.gradientsB[layer][node]/setOfInputs.length
            }
        }
    }

    resetUpdateGradients() {
        this.gradientsW = []
        this.gradientsB = []

        for (let layer = 0; layer < this.weights.length; layer++) {
            this.gradientsW.push([])
            for (let node = 0; node < this.weights[layer].length; node++) {
                this.gradientsW[layer].push([])
                for (let gw = 0; gw < this.weights[layer][node].length; gw++) {
                    this.gradientsW[layer][node].push(0)
                }
            }
        }

        for (let layer = 0; layer < this.biases.length; layer++) {
            this.gradientsB.push([])
            for (let node = 0; node < this.biases[layer].length; node++) {
                this.gradientsB[layer][node] = 0
            }
        }
    }

    calculateCost(setOfInputs, setOfExpectedOutputs) {
        return costFunctions[this.costFunction](this.predictSet(setOfInputs), setOfExpectedOutputs)
    }

    normalise(array) {
        let sizes = []
        for (let dataIndex = 0; dataIndex < array[0].length; dataIndex++) {
            sizes.push(0)
            for (let i = 0; i < array.length; i++) {
                sizes[dataIndex] += array[i][dataIndex]**2
            }
            sizes[dataIndex] = Math.sqrt(sizes[dataIndex])
            for (let i = 0; i < array.length; i++) {
                array[i][dataIndex] /= sizes[dataIndex]
            }
        }

        return array, sizes
    }

    predictSet(setOfInputs) {
        let predictions = []
        for (let i = 0; i < setOfInputs.length; i++) {
            predictions.push(this.fwdPropagation(setOfInputs[i]).slice(0, this.shape.at(-1)))
        }
        return predictions
    }

    regularisation(value = 0) {
        this.regularisationTerm = value
    }

    PCA (){

    }

    download(filename = "Neural Network.json") {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(
            {
                weights: this.weights, 
                biases: this.biases, 
                connections: this.connections, 
                activationFunction: this.activationFunction,
                outputActivationFunction: this.outputActivationFunction, 
                costFunction: this.costFunction, 
                shape: this.shape,
                regularisationTerm: this.regularisationTerm,
                learningRate: this.learningRate
            }
        )));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    upload(dict) {
        this.weights = dict.weights, 
        this.biases = dict.biases, 
        this.connections = dict.connections, 
        this.activationFunction = dict.activationFunction,
        this.outputActivationFunction = dict.outputActivationFunction, 
        this.costFunction = dict.costFunction, 
        this.shape = dict.shape,
        this.regularisationTerm = dict.regularisationTerm,
        this.learningRate = dict.learningRate

        this.layers = []
        for (let i = 0; i < this.shape.length; i++) {
            this.layers.push(new Array(this.shape[i]))
            for (let j = 0; j < this.layers[i].length; j++) {
                this.layers[i][j] = {rawValue: 0, activationValue: 0, finalValue: 0}
            }
        }

        this.resetUpdateGradients()
    }
}
