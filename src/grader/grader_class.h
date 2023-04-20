#include <iostream>
#include <stdlib.h>
#include <string>
#include <cstring>

using namespace std;

class Grader {
    private:
    // Private variables
        string language;            // configured using -l
        string testcase;            // configured using -T
        string submission_id;       // configured using -s
        string time_limit;          // configured using -t
        string mem_limit;           // configured using -m
    public:
    // Public methods
        Grader(int argc, char* args[]);
        int compile();
        int execute();
        
};