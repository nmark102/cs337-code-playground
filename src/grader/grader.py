import os

print(os.system("gcc -O2 -fno-omit-frame-pointer -fsanitize=address ./submissions/0/main.c -o ./submissions/0/a.out"))

print(os.system("(timeout 1s submissions/0/a.out ) < testcases/1-add-two-numbers/1-add-two-numbers-1.stdin >submissions/0/1-add-two-numbers-1.out 2>submissions/0/1-add-two-numbers-1.err"))
