#include "grader_class.h"

#ifndef _UTILS_H
#include "utils.h"
#endif

extern const int GRADER_CRASHED;
extern const int ACCEPTED;
extern const int COMPILER_ERROR;
extern const int RUNTIME_ERROR;
extern const int WRONG_ANSWER;
extern const int TIME_LIMIT_EXCEEDED;
extern const int MEMORY_LIMIT_EXCEEDED;

// Some default system return codes
extern const int TIMEOUT_EXIT_CODE;
extern const int MEM_LIMIT_EXIT_CODE;

// Default compiler arguments
extern const string DEFAULT_GCC_ARGS;
extern const string DEFAULT_GPP_ARGS;
extern const string DEFAULT_JAVA_ARGS;

// Default runtime arguments
extern const string DEFAULT_TIME_LIMIT;
extern const string DEFAULT_MEM_LIMIT;

// Default file paths
extern const string SUBMISSIONS_BASE_DIR;
extern const string TESTCASES_BASE_DIR;

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
                submission_id = string(args[i]);
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
            cerr << "WARNING: Unknown grader argument \"" << arg << "\". Will be ignored." << endl;
        }
    }

    // SET OPTIONAL ARGUMENTS TO DEFAULT VALUES IF NOT SPECIFIED
    // If execution time is invalid (i.e. not set, set to 0 or a negative value, or greater than 30 seconds)
    // set it to 1 second
    if (time_limit_numerical_val <= 0.0 || time_limit_numerical_val > 30.0) {
        time_limit = DEFAULT_TIME_LIMIT;
    }
    else {
        time_limit = to_string(time_limit_numerical_val) + "s ";
    }

    if (mem_limit.empty()) {
        mem_limit = DEFAULT_MEM_LIMIT;
    }

    // Throw an error if no language, submission, or testcase is specified
    if (language.empty() || submission_id.empty() || testcase.empty()) {
        string error_msg;

        if (language.empty()) {
            error_msg += "Language not specified. ";
        }
        if (submission_id.empty()) {
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
        compile_cmd = "gcc " + DEFAULT_GCC_ARGS;
        compile_cmd += "~/submissions/" + submission_id + "/main.c " + "-o ~/submissions/" + submission_id + ".out";
    }
    else if (language == "cpp") {
        compile_cmd = "g++ " + DEFAULT_GPP_ARGS;
        compile_cmd += "~/submissions/" + submission_id + "/" + "main.cpp " + "-o ~/submissions/" + submission_id + ".out";
    }
    else if (language == "java") {
        compile_cmd = "javac " + SUBMISSIONS_BASE_DIR + submission_id + "/Main.java";
    }
    // NOTE: Skip compilation step for python code
    else if (language == "python3") {
        return ACCEPTED;
    }
    else {
        throw "Language \"" + language + "\" is not supported.";
    }

    int compile_status = system(("timeout 30s " + compile_cmd).c_str());
    if (compile_status != 0) {
        cerr << "ERROR: Compilation failed." << endl;
        return COMPILER_ERROR;
    }

    return ACCEPTED;
}

int Grader::execute() {
    // Temporarily removing Docker support
    // string base_exec_cmd = "docker run timeout " + time_limit + "s ~/submissions/" + submission_id + ".out";

    // Find testcases
    string testcase_path = TESTCASES_BASE_DIR + testcase + "/";
    if (system(("ls " + testcase_path + " > tc_list.txt").c_str()) != 0) {
        cerr << "ERROR: Testcase \"" << testcase << "\" does not exist or is inaccessible." << endl;
        return GRADER_CRASHED;
    }

    // Read list of testcases
    vector<string> tc_list = {};
    try {
        readlines(&tc_list, (testcase_path + "tc_list.txt").c_str());
    }
    catch (const char* error_msg) {
        cerr << "ERROR: " << error_msg << endl;
        return GRADER_CRASHED;
    }

    // Actually execute the submission
    string base_exec_cmd = "timeout " + time_limit;

    for (string testcase: tc_list) {
        // Invoke the submission per the specified language
        string exec_cmd = base_exec_cmd; 

        if (language == "c" || language == "cpp") {
            exec_cmd += SUBMISSIONS_BASE_DIR + submission_id + "/" + submission_id + ".out ";
        }

        else if (language == "java") {
            exec_cmd = "java " + DEFAULT_JAVA_ARGS + " -cp " + SUBMISSIONS_BASE_DIR + submission_id + " Main ";
        }

        else if (language == "python3") {
            exec_cmd += "python3 " + SUBMISSIONS_BASE_DIR + submission_id + "/main.py ";
        }
        
        // Pipe I/O to/from the submission
        exec_cmd += "< " + testcase_path + testcase + " > " + SUBMISSIONS_BASE_DIR + submission_id + "/" + testcase + ".out";

        int exec_status = system(exec_cmd.c_str());

        // Check if the submission timed out
        if (exec_status == TIMEOUT_EXIT_CODE) {
            return TIME_LIMIT_EXCEEDED;
        }
        // Check if the submission crashed
        else if (exec_status == MEM_LIMIT_EXIT_CODE) {
            return MEMORY_LIMIT_EXCEEDED;
        }

        // Check if the submission's output matches the expected output
        string diff_cmd = "diff " + testcase_path + testcase + ".expected_output " 
        + SUBMISSIONS_BASE_DIR + submission_id + "/" + testcase + ".out"
        + " > " + SUBMISSIONS_BASE_DIR + submission_id + "/" + testcase + ".diff";

        if (system(diff_cmd.c_str()) != 0) {
            return WRONG_ANSWER;
        }
    }

    // Clean up submission output and diff output files
    string cleanup_cmd = "rm " + SUBMISSIONS_BASE_DIR + submission_id + "/*.diff " + SUBMISSIONS_BASE_DIR + submission_id + "/*.out";
    if (system(cleanup_cmd.c_str()) != 0) {
        cerr << "WARNING: Failed to clean up submission output and diff files." << endl;
    }
    return ACCEPTED;
}
