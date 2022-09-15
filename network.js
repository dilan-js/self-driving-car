class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      //putting in output of previous level into the new level as the input
      //final outputs will tell us if the car should go forward, backward, left, right
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
}

class Level {
  constructor(inputNeuronCount, outputNeuronCount) {
    this.inputs = new Array(inputNeuronCount);
    this.outputs = new Array(outputNeuronCount);
    this.biases = new Array(outputNeuronCount); //biases = values above which neuron will fire
    //going to connect every input neuron to output neuron
    this.weights = [];
    for (let i = 0; i < inputNeuronCount; i++) {
      this.weights[i] = new Array(outputNeuronCount);
    }

    Level.#randomize(this);
  }

  //I want to serialize this object, so making it static
  //methods don't serialize
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        //negative values b/c negative weights could tell car not to turn right
        level.weights[i][j] = Math.random() * 2 - 1; //have a value between -1 and 1.
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.lengths; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1; //turning it on
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
