#include <stdio.h>

struct Object {
  const char *name;
};

void modify(struct Object *o, int n) {
  (*o).name = "Dylan";
  n = 1000;
}

int main() {
  struct Object obj;
  obj.name = "Joe";
  int num = 700;

  printf("Before modifications:\n");
  printf("obj.name: %s\n", obj.name);
  printf("num: %d\n", num);

  modify(&obj, num);

  printf("After modifications:\n");
  printf("obj.name: %s\n", obj.name);
  printf("num: %d\n", num);

  //   printf(obj);

  return 0;
}