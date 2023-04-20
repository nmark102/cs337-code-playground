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

#ifndef _UTILS_H
#include "utils.h"
#endif

#ifndef _GRADER_CLASS_H
#include "grader_class.h"
#endif

using namespace std;

extern const string DEFAULT_GCC_ARGS;

int main(int argc, char* argv[]) {
    
    // Probe if shell is available
    if (system(NULL) == 0) {
        cerr << "Shell is not available" << endl;
        exit(GRADER_CRASHED);
    }

    Grader grader(argc - 1, argv + 1);    

    // Compile
    int compile_status;
    try {
        compile_status = grader.compile();
    } catch (const char* msg) {
        cerr << msg << endl;
        return GRADER_CRASHED;
    }

    if (compile_status != ACCEPTED) {
        return COMPILER_ERROR;
    }
    
    // Execute
    return grader.execute();
}