#include <iostream>
#include "utils.h"

using namespace std;

void readlines(vector<string>* dest, const string filename) {
    FILE* file  = fopen(filename.c_str(), "r");

    if (file == NULL) {
        throw "File " + string(filename) + " does not exist or cannot be opened.";
    }

    char line[4096];
    while (fgets(line, sizeof(line), file) != NULL) {
        dest->push_back(string(line));
    }
    fclose(file);
}