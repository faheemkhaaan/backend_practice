#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *formatNumber(char *input, char begin, char divider) {

  int length = strlen(input);
  int formattedLength = length * length / 3 + 2;
  char *formattedNumber = (char *)malloc(formattedLength);

  int j = 0;
  int commaCount = length % 3;
  formattedNumber[0] = begin;
  j = j + 1;

  for (int i = 0; i < length; i++) {
    formattedNumber[j] = input[i];
    j = j + 1;
    if (commaCount > 0 && i < length - 1 && (i + 1) % 3 == commaCount) {
      formattedNumber[j++] = divider;
    } else if (commaCount == 0 && i < length - 1 && (i + 1) % 3 == 0) {
      formattedNumber[j++] = divider;
    }
  }
  formattedNumber[j] = '\0';

  return formattedNumber;
}

int main(int argc, char *argv[]) {

  // Open one character from stdin
  FILE *outputFile = fopen(argv[1], "w");

  // Allocate memroy to save on complete number into
  char *number = (char *)malloc(10 * sizeof(char));
  int index = 0;
  // Read one character from stdin
  int c = fgetc(stdin);

  // Keep reading until we get the End of File sign.
  while (c != EOF) {
    // Accumulate the digits until we completely read one number.
    if (c != ' ') {
      number[index] = c;
      index++;
    };

    if (c == ' ') {
      if (index > 0) {
        // End the string (number) as we completely read the number
        number[index] = '\0';

        // Format the number that we just read

        char *formattedNumber = formatNumber(number, argv[2][0], argv[3][0]);

        // Write to our destination stream
        fprintf(outputFile, " %s ", formattedNumber);
        fflush(outputFile);

        // Resetting

        free(number);
        free(formattedNumber);
        number = (char *)malloc(10 * sizeof(char));
        index = 0;
      }
    }

    // Read another character from the stream
    c = fgetc(stdin);
  }

  // Close the opened file that we wrote to
  fclose(outputFile);

  exit(0);
}