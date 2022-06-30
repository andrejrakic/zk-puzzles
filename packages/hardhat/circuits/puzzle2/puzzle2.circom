pragma circom 2.0.0;

/**
 * A + A + A = 24
 * A + A * B = 80
 * B + C * B = 54
 * C + B * A = D
 *
 * A = ?
 * B = ?
 * C = ?
 * D = ?
*/

template Puzzle2() {  

   signal input a;  
   signal input b;  
   signal input c;
   signal input d; 
   signal output result;

   a + a + a === 24;
   a + a * b === 80;
   b + c * b === 54; 
   d - (c + b * a) ==> result;
}

component main = Puzzle2();