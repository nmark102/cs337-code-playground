#!/bin/bash

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

# Parse arguments
# Set language with -l
for arg in $@; do
    if [ ${arg:0:2} == "-l" ] then
        LANGUAGE=${arg:2}
    fi
done

# Set submission with -s
# Set problem with -T

# Set up default values

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
        gcc -o submission submission.c
        ;;
    cpp)
        g++ -o submission submission.cpp
        ;;
    java)
        javac submission.java
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