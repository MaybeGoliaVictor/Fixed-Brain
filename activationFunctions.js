const activationFunctions = {
    'ReLU': (x) => {
        return Math.max(0, x)
    },
    'Linear': (x) => {
        return x
    },
    'Sigmoid': (x) => {
        return 1/(1+Math.exp(-x))
    },
    'Tanh': (x) => {
        return Math.tanh(x)
    },
    'Leaky ReLU': (x) => {
        return (x>0 ? x : x*0.03)
    },
    'Softmax': (x, layer) => {
        let sum = 0
            for (let node = 0; node < layer.length; node++) {
                sum += Math.exp(layer[node].rawValue)
            }
        return Math.exp(x)/sum
    }
}

const activationDerivatives = {
    'ReLU': (x) => {
        return (x>0 ? 1 : 0)
    },
    'Linear': (x) => {
        return 1
    },
    'Sigmoid': (x) => {
        let frac = 1/(1 + Math.exp(-x))
        return frac*(1-frac)    
    },
    'Tanh': (x) => {
        return 1 - Math.tanh(x)**2
    },
    'Leaky ReLU': (x) => {
        return (x>0 ? 1 : 0.03)
    },
    'Softmax': (x, layer) => {
        let sum = 0
            for (let node = 0; node < layer.length; node++) {
                sum += Math.exp(layer[node].rawValue)
            }
        let a = Math.exp(x)
        return a * (sum - a) / (sum**2)
    }
}

const costFunctions = {
    'Mean Squared Error': (setOfOutputs, setOfExpectedOutputs) => {
        let cost = 0
        for (let i = 0; i < setOfOutputs.length; i++) {
            let outputs = setOfOutputs[i]
            for (let j = 0; j < setOfExpectedOutputs[i].length; j++) {
                cost += (setOfExpectedOutputs[i][j] - outputs[j])**2    
            }
        }
        cost /= 2*setOfOutputs.length
        return cost
    },
    'Binary Cross-Entropy': (setOfOutputs, setOfExpectedOutputs) => {
        let cost = 0
        for (let i = 0; i < setOfOutputs.length; i++) {
            let outputs = setOfOutputs[i]
            for (let j = 0; j < setOfExpectedOutputs[i].length; j++) {
                let y = setOfExpectedOutputs[i][j]
                cost += -y * Math.log(outputs[j]) - (1-y)*Math.log(1 - outputs[j])    
            }
        }
        cost /= 2*setOfOutputs.length
        return cost
    },
}

const costFunctionDerivatives = {
    'Mean Squared Error': (predicted, expected) => {
        return predicted - expected
    },
    'Binary Cross-Entropy': (predicted, expected) => {
        return (-expected/predicted) + ((1-expected) / (1-predicted))
    },
}