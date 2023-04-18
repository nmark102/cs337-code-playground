import random
import os
import sys

size = int(input())

num = []

exp = 6

for i in range(size):
    num.append(random.randrange(-10 ** exp, 10 ** exp, 1))

for i in range(len(num)):
    print(num[i], end = "")
    if i < len(num) - 1:
        print(" ")

i = random.randrange(len(num))
j = random.randrange(len(num))

print(num[i] + num[j], file = sys.stderr)
