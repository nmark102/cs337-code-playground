#include <stdio.h>
#include <stdlib.h>

int main(int argc, char * argv[]) {
    int a, b;
    char buf[16];

    // read a
    fscanf(stdin, "%d", &a);

    // read b
    fgets(buf, 16, stdin);
    b = atoi(buf);
    
    print("%d", a + b);

    return 0;
}