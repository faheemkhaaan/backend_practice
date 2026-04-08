import sys
import shutil


destination = sys.argv[1]
currency_symble = sys.argv[2]
delimiter = sys.argv[3]

with open(destination,'w') as dest:
    print("Reading from stdin press Ctrl+D to finish")
    for line in sys.stdin:
        numbers = line.split()

        for n in numbers:
            processed_line = f"{currency_symble}{n}{delimiter} "
            dest.write(processed_line)
            sys.stdout.write(processed_line)