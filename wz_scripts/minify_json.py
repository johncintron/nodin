import io
import json
import os
import sys

from base import prepare_directory, traverse_directory
from collections import OrderedDict


def minify_json_str(json_str):
    od = json.loads(json_str, object_pairs_hook=OrderedDict)
    return json.dumps(od, ensure_ascii=False, separators=(',', ':'))

def callback(in_filename, out_filename):
    f = io.open(in_filename, encoding='utf-8')
    json_str = f.read()
    f.close()

    res = minify_json_str(json_str)

    prepare_directory(out_filename)

    f = io.open(out_filename, 'w', encoding='utf-8')
    f.write(res)
    f.close()

def main():
    traverse_directory(sys.argv[1], sys.argv[2], callback)

if __name__ == '__main__':
    main()
