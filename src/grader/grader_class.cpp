#include "grader_class.h"

#ifndef _UTILS_H
#include "utils.h"
#endif

extern const string DEFAULT_GCC_ARGS;
extern const string DEFAULT_GPP_ARGS;

class Grader {
    private:
    // Private variables
        string language;            // configured using the -l flag
        string testcase;            // configured using the -T flag
        string submission;          // configured using the -s flag
        float time_limit;           // configured using the -t flag

    public:
        Grader(int argc, char* args[]) {
            time_limit = 0.0;
            
            int i = 0;
            while (i < argc) {
                char* arg = args[i];

                // Set language
                if (strcmp(arg, "-l") == 0) {
                    ++i;

                    if (i < argc) {
                        language = string(args[i]);
                    }
                }

                // Set execution time
                else if (strcmp(arg, "-t") == 0) {
                    ++i;

                    if (i < argc) {
                        time_limit = atof(args[i]);
                    }
                }
                
                // Set testcase
                else if (strcmp(arg, "-T") == 0) {
                    ++i;

                    if (i < argc) {
                        testcase = string(args[i]);
                    }
                }

                // Set submission
                else if (strcmp(arg, "-s") == 0) {
                    ++i;

                    if (i < argc) {
                        submission = string(args[i]);
                    }
                }
                i++;
            }

            // If execution time is invalid (i.e. not set, set to 0 or a negative value, or greater than 30 seconds)
            // set it to 1 second
            if (time_limit <= 0.0 || time_limit > 30.0) {
                time_limit = 1.0;
            }

            // Throw an error if no language, submission, or testcase is specified
            if (language.empty() || submission.empty() || testcase.empty()) {
                string error_msg;

                if (language.empty()) {
                    error_msg += "Language not specified. ";
                }
                if (submission.empty()) {
                    error_msg += "Submission not specified. ";
                }
                if (testcase.empty()) {
                    error_msg += "Testcase not specified. ";
                }
            }
        }

        int compile() {
            // Compile the submission
            string compile_cmd;
            // int compile_status = system(compile_cmd.c_str());

            if (language == "c") {
                compile_cmd = "gcc " + DEFAULT_GCC_ARGS + submission + " -o " + submission + ".out";
            }
            else if (language == "cpp") {
                compile_cmd = "g++ " + DEFAULT_GPP_ARGS + submission + " -o " + submission + ".out";
            }
            else if (language == "java") {
                compile_cmd = "javac " + submission;
            }
            // NOTE: Skip compilation step for python code
            else if (language == "python3") {
                return 0;
            }
            else {
                cerr << "WARNING: Language \"" << language << "\" is not supported (for now). Skipping compilation step." << endl;
            }
        }

        int execute() {

        }
};