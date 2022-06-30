pragma circom 2.0.0;

/**
 *   _____       _____
 *  |  A  |  -  |  B  |  =  2
 *   -----       -----
 *     +           +
 *   _____       _____ 
 *  |  C  |  +  |  D  |  =  8
 *   -----       -----
 *     =           =
 *     10          6
 *
 *
 *   A = ?
 *   B = ?
 *   C = ?
 *   D = ?
*/

template Puzzle3() {  
   signal input a;  
   signal input b;  
   signal input c;
   signal input d; 
   signal output res1;
   signal output res2;
   signal output res3;
   signal output res4;

   res1 <== a - b;
   res2 <== a + c;
   res3 <== b + d;
   res4 <== c + d;
}

component main = Puzzle3();