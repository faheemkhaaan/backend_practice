#include <stdio.h>

// argc stands for argument count and argv stands for arguments vector.
int main(int argc, char *argv[]) {

  for (int i = 0; i < argc; i++) {
    printf("Argument %d is: %s\n", i, argv[i]);
  }

  return 0;
}