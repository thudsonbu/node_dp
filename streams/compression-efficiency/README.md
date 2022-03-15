# Compression Efficiency

### Description

Compares the relative speed and efficiency of the three compression algorithms supported natively in node.

### Getting Started

To run the program use:
```bash
node compression-efficiency.js
```

You will be prompted to enter a file to compress from the `input` directory as well as what encryption algorithm to use. The time taken to compress the file as well as the size of the file will be output.

The results from the experiment emphasize the advantages of Brotli style compression when repeated data is used. Since Brotli creates key value stores of repeats, the result ends up being far smaller then for Gzip of Deflate for `message.txt`. However, since `message2.txt` does not exhibit repetition, the algorithms are much closer together.
