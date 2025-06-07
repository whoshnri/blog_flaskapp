# This folder stores the frontend requirements for this project

import json


with open("../frontend/package.json" , 'r') as file:
    data = json.load(file)

devDependencies = data.get('devDependencies')
file_content = ''

for name, version in devDependencies.items():
    file_content += f'{name} : {version} \n'

with open('react_dependencies.txt', 'w') as file:
    file.write(file_content)

    