#include <stdio.h>

// int add(int a, int b) { return a + b; }

int main() {
  // int , size_t, char, float
  //   int a = 2;
  //   int b = 3;
  //   int c = add(a, b);
  // float b = 234.234;
  // fprintf(stdout, "This is a %d string", sum);

  //   char my_character = "g";

  // size_t t = 0 18...

  //   fprintf(stdout, "Size of a long int value is : %zu bytes.\n", sizeof(long
  //   int));

  size_t t = 18446744073709551615;

  fprintf(stdout, "t is %zu.\n", t);

  return 0;
}