# @file: build.sh
# @author: Mark Nguyen

g++ -O2 -fno-omit-frame-pointer -fsanitize=address -o ./bin/grader ./src/grader/grader.cpp ./src/grader/utils.h ./src/grader/grader_class.h