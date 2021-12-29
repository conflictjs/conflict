import { spawn } from 'child_process';
import chalk from 'chalk';
const babel = spawn('npx', 'babel bot --out-dir .conflict --watch'.split(' '));
babel.stdout.setEncoding('utf8');
babel.stderr.setEncoding('utf8');
babel.stdout.on('data', (chunk) => {
  console.log(chalk.yellow('Babel > ') + chunk);
});
babel.stderr.on('data', (chunk) => {
  console.error(chalk.yellow('Babel > ') + chunk);
});
babel.on('close', (code) => {
  console.log(`Babel exited with code ${code}`);
});

const runner = spawn('npm', 'run start'.split(' '), { stdio: ['pipe', 'pipe', 'pipe'],env : process.env});
runner.stdout.setEncoding('utf8');
runner.stderr.setEncoding('utf8');
runner.stdout.on('data', (chunk) => {
    console.log(chunk);
});
process.stdin.pipe(runner.stdin);
runner.stderr.on('data', (chunk) => {
    console.error(chunk);
});
runner.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
process.stdin.on('end', (chunk) => {
    runner.stdin.pause();
    runner.kill();
});

console.log(chalk.blue('Conflict > ') + 'Development server started. Please use only Ctrl+C to exit.');