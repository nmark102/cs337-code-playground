/**
 * @file grader.cpp
 * @author Mark Nguyen (trimarknguyen@gmail.com)
 * 
 * @version 0.1
 * @date 2023-04-08
 * 
 * @copyright Copyright (c) 2023
 * 
 */

#include <iostream>
#include <stdlib.h>

#include "utils.h"

using namespace std;

extern const string DEFAULT_GCC_ARGS;

int main(int argc, char* argv[]) {
    const string cmd = "python3 main.py";
    cout << system(cmd.c_str()) << endl;
}