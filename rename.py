import os

directories = [
    'c:\\Users\\nalla\\Downloads\\ABB_Project-main\\ABB_Project-main\\frontend\\src',
    'c:\\Users\\nalla\\Downloads\\ABB_Project-main\\ABB_Project-main\\backend'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    content = content.replace('Adaptive AI', 'Aura AI')
    content = content.replace('Adaptive', 'Aura')
    content = content.replace('adaptive', 'aura')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.py'):
                process_file(os.path.join(root, file))

print("Rename complete!")
