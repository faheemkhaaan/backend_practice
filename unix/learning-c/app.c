#include <stdio.h>

// int add(int a, int b) { return a + b; }
int length(char s[]) {
  char c = s[0];

  int length = 0;
  while (c != '\0') {
    length++;
    c = s[length];
  }
  return length;
};
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

  size_t t = 18446744073709551615ULL;

  fprintf(stdout, "t address is %p.\n", &t);

  // for (int i = 0; i < sizeof(size_t); ++i) {
  //   printf("Byte %d address: %p\n", i, (&t + i));
  // }

  int a = 20;
  int *my_pointer = &a;

  // *(my_pointer);

  char myStr[6];

  myStr[0] = 'T';
  myStr[1] = 'e';
  myStr[2] = 's';
  myStr[3] = 't';
  myStr[4] = '\0';

  char *myOtherStr = "This is my string";

  printf("My string is: %p\n", myStr);
  printf("My string is: %s\n", myOtherStr);
  printf("The length my string is: %d\n", length(myOtherStr));

  return 0;
}