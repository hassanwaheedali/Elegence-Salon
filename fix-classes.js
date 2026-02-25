import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('[text-champagne]')) {
                content = content.replace(/\[text-champagne\]/g, 'champagne');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Replaced in ${fullPath}`);
            }
        }
    });
}
replaceInDir('d:/React Practise/Elegence React Version/Elegance/src');
