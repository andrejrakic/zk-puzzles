pragma circom 2.0.0;

// include "../../node_modules/circomlib/circuits/comparators.circom";

// What is the only positive integer solution of aᵇ=bᵃ, assuming that a≠b?

template Puzzle1() {
   signal input a;  // private by default
   signal input b;  // private by default
   signal output result;  // always public

   assert(a > 0 && b > 0);
   assert(a % 1 == 0 && b % 1 == 0);
   assert(a != b);

   (a ** b) - (b ** a) --> result;

   result === 0;
} 

component main = Puzzle1();