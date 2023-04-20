#include <iostream>
#include <vector>

using namespace std;

// Default verdicts
const int GRADER_CRASHED = -1;
const int ACCEPTED = 0;
const int COMPILER_ERROR = 1;
const int RUNTIME_ERROR = 2;
const int WRONG_ANSWER = 3;
const int TIME_LIMIT_EXCEEDED = 4;
const int MEMORY_LIMIT_EXCEEDED = 5;

// Some default system return codes
const int TIMEOUT_EXIT_CODE = 124;
const int MEM_LIMIT_EXIT_CODE = 137;

// Default compiler arguments
const string DEFAULT_GCC_ARGS = "-O2 -fno-omit-frame-pointer -fsanitize=address ";
const string DEFAULT_GPP_ARGS = "-O2 -fno-omit-frame-pointer -fsanitize=address ";
const string DEFAULT_JAVA_ARGS = "";

// Default runtime arguments
const string DEFAULT_TIME_LIMIT = "1s ";
const string DEFAULT_MEM_LIMIT = "64m ";

// Default file paths
const string SUBMISSIONS_BASE_DIR = "./submissions/";
const string TESTCASES_BASE_DIR = "./testcases/";

// Function headers
void readlines(vector<string>* dest, const string filename);
