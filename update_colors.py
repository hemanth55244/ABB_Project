import os
import re

directory = 'c:\\Users\\nalla\\Downloads\\ABB_Project-main\\ABB_Project-main\\frontend\\src'

replacements = {
    'purple-': 'amber-',
    'blue-': 'yellow-',
    'indigo-': 'orange-'
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Also fix index.css variables if present
    content = content.replace('8b5cf6', 'f59e0b') # purple to amber
    content = content.replace('3b82f6', 'eab308') # blue to yellow

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.css'):
            process_file(os.path.join(root, file))

print("Color update complete!")
