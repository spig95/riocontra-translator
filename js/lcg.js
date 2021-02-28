/**
* Basic LCG pseudo random generator. To be used instead of JS one if the user
* wants to specify the random seed.
*
* var generator = new LCG(seed);
* var number = generator.getNumber();
* var u = generator.getUniform();
*/
export class LCG {

  // Good set of parameters for Linear Congurential Generator
  m = Math.pow(2, 32);
  a = 1664525;
  c = 1013904223;

  constructor(
    seed) {

    if (seed == undefined) {
        throw "please enter an integer seed for LCG";
    }

    this.X0 = seed;

    // Convert to integer if needed
    if (typeof this.X0 === 'string'){
      // Check if the string can become directly an integer
      this.X0 = parseInt(seed, 10);
      if (isNaN(this.X0)) {
        throw "Cannot convert seed (" + this.X0 + ") to an integer.";
      }
    } else if (typeof this.X0 === 'number') {
      // Make sure that the number is an integer
      this.X0 = Math.floor(this.X0);
    }

    // Put seed in the correct range.
    // Step 1: make sure we have a positive seed
    if (this.X0 < 0){
      console.log(
        "Seed (" + this.X0 + ") Must be higher than 0. Flipping sign.")
      this.X0 = - this.X0;
    }

    // Step 2: X0 smaller than m
    if (this.X0 >= this.m) {
      console.log(
        "Seed (" + this.X0 + ") is too large! Clipping it to " + (this.m - 1))
        this.X0 = this.m - 1
    }

    // Something might go wrong, let's check
    if (! Number.isInteger(this.X0)) {
      throw "Not able to convert seed (" + this.X0 + ") to an integer";
    } else {
      console.log(
        "Instantiated LCG generator." +
        "\n  - Seed: " + this.X0 + 
        "\n  - m:    " + this.m +
        "\n  - c:    " + this.c +
        "\n  - a:    " + this.a
        );
    }

  };

  // Apply LCG formula
  getNumber() {
    this.X0 = (this.a * this.X0 + this.c) % this.m;
    return this.X0;
  }

  // Get a value between 0 and 1
  getUniform() {
    return this.getNumber() / this.m;
  };
	
};