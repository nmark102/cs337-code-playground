echo "Testing grader"
echo "=============="


echo "Testcase 0: Language: C. Expected status 0 (accepted)."
echo $(./bin/grader -l c -T 1-add-two-numbers -s 0)

echo "Testcase 1: Language: Python. Expected status 0 (accepted)."
echo $(./bin/grader -l python3 -t 2 -T 1-add-two-numbers -s 1)

echo "Testcase 2: Language: Java. Expected status 1 (compile error)."

echo $?

echo "Testcase 3: Language: C. Expected status 4 (time limit exceeded)."

echo $?

echo "Testcase 4: Language: Python. Expected status 2 (wrong answer)."

echo $?