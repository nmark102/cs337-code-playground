#include <iostream>
#include <stdlib.h>
#include <string>
#include <cstring>

#define VERBOSE

using namespace std;

class Grader {
    private:
    // Private variables
        string language;            // configured using -l
        string testcase;            // configured using -T
        string submission_id;       // configured using -s
        string time_limit;          // configured using -t, optional
        string mem_limit;           // configured using -m, optional
    public:
    // Public methods
        Grader(int argc, char* args[]);
        void printConfigs();
        int compile();
        int execute();
        ~Grader();
        
};