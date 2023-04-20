#include "grader_class.h"

#ifndef _UTILS_H
#include "utils.h"
#endif

extern const string SUBMISSIONS_BASE_DIR;

extern const string DEFAULT_TIME_LIMIT;
extern const string DEFAULT_MEM_LIMIT;
extern const string DEFAULT_GCC_ARGS;
extern const string DEFAULT_GPP_ARGS;

Grader::Grader(int argc, char* args[]) {
    float time_limit_numerical_val = 0.0;
    
    for (int i = 0; i < argc; ++i) {
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
                time_limit_numerical_val = atof(args[i]);
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

        // Set memory limit
        else if (strcmp(arg, "-m") == 0) {
            ++i;

            if (i < argc) {
                mem_limit = string(args[i]);
            }
        }
        else {
            cerr << "WARNING: Unknown grader argument \"" << arg << "\"" << endl;
        }
    }

    // SET OPTIONAL ARGUMENTS TO DEFAULT VALUES IF NOT SPECIFIED
    // If execution time is invalid (i.e. not set, set to 0 or a negative value, or greater than 30 seconds)
    // set it to 1 second
    if (time_limit_numerical_val <= 0.0 || time_limit_numerical_val > 30.0) {
        time_limit = DEFAULT_MEM_LIMIT;
    }
    else {
        time_limit = to_string(time_limit_numerical_val) + "s";
    }

    if (mem_limit.empty()) {
        mem_limit = DEFAULT_MEM_LIMIT;
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

        throw "ERROR: " + error_msg + "\n";
    }
}

int Grader::compile() {
    // Compile the submission
    string compile_cmd;

    if (language == "c") {
        compile_cmd = "gcc" + DEFAULT_GCC_ARGS;
        compile_cmd += "~/submissions/" + submission + "/main.c " + "-o ~/submissions/" + submission + ".out";
    }
    else if (language == "cpp") {
        compile_cmd = "g++" + DEFAULT_GPP_ARGS;
        compile_cmd += "~/submissions/" + submission + "/" + "main.cpp " + "-o ~/submissions/" + submission + ".out";
    }
    else if (language == "java") {
        compile_cmd = "javac ~/submissions/" + submission + "/Main.java";
    }
    // NOTE: Skip compilation step for python code
    else if (language == "python3") {
        return 0;
    }
    else {
        cerr << "WARNING: Language \"" << language << "\" is not supported (for now). Skipping compilation step." << endl;
        return 1;
    }

    int compile_status = system(("timeout 30s " + compile_cmd).c_str());
    if (compile_status != 0) {
        cerr << "ERROR: Compilation failed." << endl;
        return 1;
    }
}

int Grader::execute() {
    string base_exec_cmd = "docker run timeout " + time_limit + "s ~/submissions/" + submission + ".out";
}
