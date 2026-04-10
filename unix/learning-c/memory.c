#include <stdio.h>
#include <stdlib.h>

int main() {

  // int is 4 bytes (32 bits) - singed
  int a = 3500;

  int *myPointer = &a;

  // type casting
  char *charPointer = (char *)myPointer;

  printf("%p\n", charPointer);

  // stack memory , heap memory
  // stack memroy is small usually (8MB)

  int *allocatedMemory = malloc(12); // 12 bytes;

  allocatedMemory[2];

  for (int i = 0; i < 3; i++) {
    allocatedMemory[i] = 1937208183;
  }

  for (int i = 0; i < 3; i++) {
    printf("Number is: %d\n", allocatedMemory[i]);
  }

  char *charAllocatedMemory = (char *)allocatedMemory;

  for (int i = 0; i < 12; i++) {
    printf("%c", charAllocatedMemory[i]);
  }
  printf("\n");
  return 0;
}