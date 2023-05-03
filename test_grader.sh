cd src/grader/
./build_grader.sh
cd ../../

echo "Testing grader"
echo "=============="


echo "Testcase 0: Language: C. Expected status 0 (accepted)."
echo $(./bin/grader -l c -T 1-add-two-numbers -s 0)
echo $?
echo

echo "Testcase 1: Language: Python. Expected status 0 (accepted)."
echo $(./bin/grader -l python3 -t 2 -T 1-add-two-numbers -s 1)
echo $?
echo

echo "Testcase 2: Language: Java. Expected status 1 (compile error)."
echo $(./bin/grader -l java -T 1-add-two-numbers -s 2)
echo $?
echo

echo "Testcase 3: Language: C. Expected status 4 (time limit exceeded)."
echo $(./bin/grader -l c -T 1-add-two-numbers -s 3)
echo $?
echo

echo "Testcase 4: Language: Python. Expected status 2 (wrong answer)."
echo $(./bin/grader -l python3 -t 2 -T 1-add-two-numbers -s 4)


# rm -f ./submissions/*/*.out ./submissions/*/*.err ./submissions/*/*.diff ./submissions/*/*.class ./submissions/*/compiler_output.txt