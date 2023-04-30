#!/bin/bash

# Default settings
SUBMISSIONS_BASE_DIR="~/submissions/"
TESTCASES_BASE_DIR="~/testcases/"
DEFAULT_GCC_ARGS="-O2 -fno-omit-frame-pointer -fsanitize=address "
DEFAULT_GPP_ARGS="-O2 -fno-omit-frame-pointer -fsanitize=address "

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
            if [ $((i+1)) -gt $# ] then
                echo "Submission ID not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                SUBMISSION_ID=${!i}
            fi
            ;;
        -l)
            if [ $((i+1)) -gt $# ] then
                echo "Language not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                LANGUAGE=${!i}
            fi
            ;;
        -T)
            if [ $((i+1)) -gt $# ] then
                echo "Problem ID not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                PROBLEM_ID=${!i}
            fi
            ;;
        -t)
            if [ $((i+1)) -gt $# ] then
                echo "Time limit not specified"
                exit ${GRADER_CRASHED}
            else
                i=$((i+1))
                TIME_LIMIT=${!i}
            fi
            ;;
        -m)
            if [ $((i+1)) -gt $# ] then
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

if [ ${TIME_LIMIT}=="" ] then
    TIME_LIMIT="1s"
fi

if [ ${MEM_LIMIT}=="" ] then
    MEM_LIMIT="64m"
fi

# Make sure that submission, language, and problem are specified
if   [ ${SUBMISSION_ID}=="" ] then
    echo "Submission ID not specified"
    exit ${GRADER_CRASHED}
elif [ ${LANGUAGE}=="" ] then
    echo "Language not specified"
    exit ${GRADER_CRASHED}
elif [ ${PROBLEM_ID}=="" ] then
    echo "Problem ID not specified"
    exit ${GRADER_CRASHED}
fi

# Compile
case ${LANGUAGE} in
    c)
        gcc ${DEFAULT_GCC_ARGS} -o ~/submissions/${SUBMISSION_ID}/a.out ~/submissions/${SUBMISSIONS_ID}/main.c
        ;;
    cpp)
        g++ ${DEFAULT_GPP_ARGS} -o ~/submissions/${SUBMISSIONS_ID}/a.out ~/submissions/${SUBMISSIONS_ID}/main.cpp
        ;;
    java)
        javac ~/submissions/${SUBMISSION_ID}/Main.java
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

# Run