import sys

with open('body.txt', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace('24c80a398cbbc5869c2c58085167079d7120e495', '791d4014081b9f0b37fba48ededfd9f9ce9c0307')

with open('body.txt', 'w', encoding='utf-8') as f:
    f.write(new_content)
