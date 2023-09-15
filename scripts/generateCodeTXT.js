// file: /scripts/generateCodeTXT.js

const fs = require('fs');
const path = require('path');

// Set the path to your Next.js project
const projectPath = './';

// Specify the folders to print the content
const foldersToPrintContent = ['pages', 'components', 'hooks', 'styles', 'prompts'];

function printContent(dir, prefix = '', folderName = '') {
  let fileContent = '';

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.lstatSync(filePath).isDirectory();

    if (!isDirectory) {
      fileContent += `${prefix}Content of ${folderName}/${file}:\n${prefix}${fs.readFileSync(filePath, 'utf8')}\n`;
    } else {
      fileContent += printContent(filePath, prefix, `${folderName}/${file}`);
    }
  });

  return fileContent;
}

function generateContentForFolders() {
  let content = '';

  foldersToPrintContent.forEach((folder) => {
    const folderPath = path.join(projectPath, folder);
    content += printContent(folderPath, '  ', folder);
  });

  fs.writeFileSync('projectCode.txt', content);
  console.log('File content generated successfully.');
}

generateContentForFolders();
module.exports = generateContentForFolders
