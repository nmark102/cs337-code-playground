#include <iostream>
#include <stdlib.h>
#include <cstring>

using namespace std;

class Grader {
    private:
        string language;
        string testcase;
        string submission_dir;
        float time_limit;

    public:
        Grader(int argc, char* args[]) {
            time_limit = 0.0;
            
            int i = 0;
            while (i < argc) {
                char* arg = args[i];

                
                if (strcmp(arg, "-t") == 0) {
                    ++i;

                }
                
                else if (strcmp(arg, "-l") == 0) {

                }

                i++;
            }
        }

        void execute() {

        }
};