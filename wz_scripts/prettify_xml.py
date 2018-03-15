import io
import os
import sys

from base import prepare_directory, traverse_directory
from xml.dom import minidom


def prettify_xml(xml_str):
    xml = minidom.parseString(xml_str)
    pretty_xml_str = xml.toprettyxml('    ', '\n', 'utf-8').decode('utf-8')
    body = pretty_xml_str.split('\n')[1:]
    return '\n'.join(body)

def callback(in_filename, out_filename):
    f = io.open(in_filename, encoding='utf-8')
    xml_str = f.read().replace('&amp;lt;', '&lt;')
    f.close()

    res = prettify_xml(xml_str)

    prepare_directory(out_filename)

    f = io.open(out_filename, 'w', encoding='utf-8')
    f.write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
    f.write(res)
    f.close()

def main():
    traverse_directory(sys.argv[1], sys.argv[2], callback)

if __name__ == '__main__':
    main()

