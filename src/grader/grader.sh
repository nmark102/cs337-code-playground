#!/bin/bash

# Default settings
SUBMISSIONS_BASE_DIR="/root/submissions/"
TESTCASES_BASE_DIR="/root/testcases/"

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
if [ "${TIME_LIMIT}" == "" ]; then
    TIME_LIMIT="1s"
fi

if [ "${MEM_LIMIT}" == "" ]; then
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
# CLEANUP_SUBMISSIONS="ls ${SUBMISSION_DIR}* | grep -v -E '*.c|*.cpp|*.java|*.py|*.js' | xargs rm"
CLEANUP_SUBMISSIONS=
COMPILE_CMD=

# Compile
case ${LANGUAGE} in
    c)
        COMPILE_CMD="gcc ${DEFAULT_GCC_ARGS} -o ${SUBMISSION_DIR}a.out ${SUBMISSION_DIR}main.c"
        ;;
    cpp)
        COMPILE_CMD="g++ ${DEFAULT_GPP_ARGS} -o ${SUBMISSION_DIR}a.out ${SUBMISSION_DIR}main.cpp"
        ;;
    java)
        COMPILE_CMD="javac ${SUBMISSION_DIR}Main.java"
        ;;
    python | javascript)
        # Nothing to compile
        ;;
    *)
        echo "Language ${LANGUAGE} not supported"
        exit ${GRADER_CRASHED}
        ;;
esac

COMPILE_RESULT=$(${COMPILE_CMD})

if [ "${COMPILE_RESULT}" != "" ]; then
    echo "${COMPILE_RESULT}" > ${SUBMISSION_DIR}compile.log

    echo "Compiler error. See ${SUBMISSION_DIR}compile.log for details.}"
    ${CLEANUP_SUBMISSIONS}
    exit ${COMPILER_ERROR}
fi

# Run
for TESTCASE_PATH in $(ls ${TESTCASES_BASE_DIR}${PROBLEM_ID}*/*.stdin)
do
    EXEC_CMD=
    case ${LANGUAGE} in
    c | cpp)
        # Run the program
        EXEC_CMD="timeout ${TIME_LIMIT} \
            ${SUBMISSION_DIR}a.out < ${TESTCASE_PATH} \
            1>${SUBMISSION_DIR}output.txt 2>${SUBMISSION_DIR}stderr_output.txt"
        ;;
    java)

        ;;
    python3)

        ;;
    javascript)

        ;;
    *)
        echo "You should never hit this point. Language ${LANGUAGE} not supported in the execution step."
        exit ${GRADER_CRASHED}
        ;;
    esac

    EXEC_RESULT=$(${EXEC_CMD})

    if [ "$(cat ${SUBMISSION_DIR}stderr_output.txt)" != "" ]; then
        echo "Runtime error. See ${SUBMISSION_DIR}stderr_output.txt for details."
        ${CLEANUP_SUBMISSIONS}
        exit ${RUNTIME_ERROR}
    fi
      
    # Compare output
    if [ "$(diff -wB ${SUBMISSION_DIR}output.txt ${TESTCASE_PATH%.stdin}.stdout)" != "0" ]; then
        exit ${WRONG_ANSWER}
    fi
done

# Remove everything but the source code files
${CLEANUP_SUBMISSIONS}

exit ${ACCEPTED}