#include <iostream>
#include <vector>

using namespace std;

// Some default constants
const string DEFAULT_GCC_ARGS = " -O2 -fno-omit-frame-pointer -fsanitize=address ";

void readlines(vector<string>& dest, const string filename);