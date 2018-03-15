import os


def remove_attributes(node, attributes):
    for attribute in attributes:
        node.attrib.pop(attribute, None)
    if len(node) == 0:
        return
    for child in node:
        remove_attributes(child, attributes)

def traverse_directory(in_path, out_path, callback=None):
    for filename in sorted(os.listdir(in_path)):
        in_filename = os.path.join(in_path, filename)
        out_filename = os.path.join(out_path, filename)
        if os.path.isdir(in_filename):
            traverse_directory(in_filename, out_filename, callback)
        else:
            callback and callback(in_filename, out_filename)

def prepare_directory(filename):
    dirs = filename.split(os.path.sep)[:-1]
    out_dir = os.path.join(*dirs)
    os.makedirs(out_dir, exist_ok=True)
