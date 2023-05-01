#!/bin/bash

# Default settings
SUBMISSIONS_BASE_DIR="~/submissions/"
TESTCASES_BASE_DIR="~/testcases/"
DEFAULT_GCC_ARGS="-O2 -fno-omit-frame-pointer -fsanitize=address"
DEFAULT_GPP_ARGS="-O2 -fno-omit-frame-pointer -fsanitize=address"

# Set up default return codes
GRADER_CRASHED=-1
ACCEPTED=0
COMPILER_ERROR=1
RUNTIME_ERROR=2
WRONG_ANSWER=3
TIME_LIMIT_EXCEEDED=4
MEMORY_LIMIT_EXCEEDED=5

# Set up parameters
SUBMISSION_ID=
LANGUAGE=
PROBLEM_ID=
TIME_LIMIT=
MEM_LIMIT=

# Parse arguments
i=1
while [ $i -le $# ]
do
    case ${!i} in
        -s)
            if [ $((i+1)) -gt $# ]; then
                echo "Submission ID not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                SUBMISSION_ID=${!i}
            fi
            ;;
        -l)
            if [ $((i+1)) -gt $# ]; then
                echo "Language not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                LANGUAGE=${!i}
            fi
            ;;
        -T)
            if [ $((i+1)) -gt $# ]; then
                echo "Problem ID not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                PROBLEM_ID=${!i}
            fi
            ;;
        -t)
            if [ $((i+1)) -gt $# ]; then
                echo "Time limit not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                TIME_LIMIT=${!i}
            fi
            ;;
        -m)
            if [ $((i+1)) -gt $# ]; then
                echo "Memory limit not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                MEM_LIMIT=${!i}
            fi
            ;;
        *)
            i=$((i+1))
            ;;
    esac
    i=$((i+1))
done

# Set up default values
if [ ${TIME_LIMIT}=="" ]; then
    TIME_LIMIT="1s"
fi

if [ ${MEM_LIMIT}=="" ]; then
    MEM_LIMIT="64m"
fi

# Making sure the grader is properly configured
echo "Problem:      ${PROBLEM_ID}"
echo "Submission:   ${SUBMISSION_ID}"
echo "Language:     ${LANGUAGE}"
echo "Time limit:   ${TIME_LIMIT}"
echo "Memory limit: ${MEM_LIMIT}"

# Make sure that submission, language, and problem are specified
if   [ -z ${SUBMISSION_ID} ]; then
    echo "Submission ID not specified"
    exit ${GRADER_CRASHED}
elif [ -z ${LANGUAGE} ]; then
    echo "Language not specified"
    exit ${GRADER_CRASHED}
elif [ -z ${PROBLEM_ID} ]; then
    echo "Problem ID not specified"
    exit ${GRADER_CRASHED}
fi

SUBMISSION_DIR="${SUBMISSIONS_BASE_DIR}${SUBMISSION_ID}/"

COMPILE_CMD=

# Compile
case ${LANGUAGE} in
    c)
        COMPILE_CMD="gcc ${DEFAULT_GCC_ARGS} -o ${SUBMISSION_DIR}a.out ${SUBMISSION_DIR}main.c 1>${SUBMISSION_DIR}compile.log 2>&1"
        ;;
    cpp)
        COMPILE_CMD="g++ ${DEFAULT_GPP_ARGS} -o ${SUBMISSION_DIR}a.out ${SUBMISSION_DIR}main.cpp 1>${SUBMISSION_DIR}compile.log 2>&1"
        ;;
    java)
        COMPILE_CMD="javac ${SUBMISSION_DIR}Main.java 1>${SUBMISSION_DIR}compile.log 2>&1"
        ;;
    python)
        # Nothing to compile
        ;;
    javascript)
        # Nothing to compile
        ;;
    *)
        echo "Language ${LANGUAGE} not supported"
        exit ${GRADER_CRASHED}
        ;;
esac

if [ $(COMPILE_CMD) -ne ((0)) ]; then
    echo "Compiler error. See ${SUBMISSION_DIR}compile.log for details.}"
    ls ${SUBMISSION_DIR}* | grep -v -E '.c\|.cpp.\|.java\|.py\|.js' | xargs rm
    exit ${COMPILER_ERROR}
fi

# Run
for TESTCASE_PATH in $(ls ~/testcases/${PROBLEM_ID}*/*.stdin)
do
    EXEC_CMD=
    case ${LANGUAGE} in
    c | cpp)
        # Run the program
        EXEC_CMD="timeout ${TIME_LIMIT} \
            ${SUBMISSION_DIR}a.out < ${TESTCASE_PATH} \
            > ${SUBMISSION_DIR}output.txt 2>${SUBMISSION_DIR}stderr_output.txt"
        ;;
    java)

        ;;
    python3)

        ;;
    javascript)

        ;;
    esac
        echo "You should never hit this point. Language ${LANGUAGE} not supported in the execution step."

    if [ $(EXEC_CMD) -ne ((0)) ]; then
        echo "Runtime error. See ${SUBMISSION_DIR}stderr_output.txt for details."
        ls ${SUBMISSION_DIR}* | grep -v -E '.c\|.cpp.\|.java\|.py\|.js' | xargs rm
        exit ${RUNTIME_ERROR}
    fi
      
    # Compare output
    if [ $(diff -wB ${SUBMISSION_DIR}output.txt ${TESTCASE_PATH%.stdin}.stdout) -ne ((0)) ]; then
        exit ${WRONG_ANSWER}
    fi
done

# Remove everything but the source code files
ls ${SUBMISSION_DIR}* | grep -v -E '.c\|.cpp.\|.java\|.py\|.js' | xargs rm

exit ${ACCEPTED}