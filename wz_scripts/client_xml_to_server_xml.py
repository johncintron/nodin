import io
import os
import sys

from base import prepare_directory, traverse_directory, remove_attributes
from xml.etree.ElementTree import fromstring, tostring


def callback(in_filename, out_filename):
    f = io.open(in_filename, encoding='utf-8')
    xml_str = f.read().replace('&amp;lt;', '&lt;')
    f.close()

    et = fromstring(xml_str)
    remove_attributes(et, {'basedata', })
    res = tostring(et, encoding='utf-8').decode('utf-8')

    prepare_directory(out_filename)

    f = io.open(out_filename, 'w', encoding='utf-8')
    f.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
    f.write(res)
    f.close()

def main():
    traverse_directory(sys.argv[1], sys.argv[2], callback)

if __name__ == '__main__':
    main()
