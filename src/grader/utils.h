#include <iostream>
#include <vector>

using namespace std;

// Some default constants
const string DEFAULT_TIME_LIMIT = " 1s ";
const string DEFAULT_MEM_LIMIT = "64m";
const string DEFAULT_GCC_ARGS = " -O2 -fno-omit-frame-pointer -fsanitize=address ";
const string DEFAULT_GPP_ARGS = " -O2 -fno-omit-frame-pointer -fsanitize=address ";

void readlines(vector<string>& dest, const string filename);