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

vector<string> split(string s, string delimiter) {
    size_t pos_start = 0, pos_end, delim_len = delimiter.length();
    std::string token;
    std::vector<std::string> res;

    while ((pos_end = s.find(delimiter, pos_start)) != std::string::npos) {
        token = s.substr (pos_start, pos_end - pos_start);
        pos_start = pos_end + delim_len;
        res.push_back (token);
    }

    res.push_back (s.substr (pos_start));
    return res;
}
