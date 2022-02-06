import { spawn, exec } from 'child_process';
import chalk from 'chalk';
import { stdin } from 'process';
let projectDirectory = process.cwd();
const build = exec('npx babel bot --out-dir .conflict', { cwd: projectDirectory }, () => {
  const babel = spawn('npx', 'babel bot --out-dir .conflict --watch'.split(' '), { cwd: projectDirectory });
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
  function spawnRunner () {
    const runner = spawn('npx', 'conflict'.split(' '), { stdio: ['pipe', 'pipe', 'pipe'], env: process.env, cwd: projectDirectory });
    runner.stdout.setEncoding('utf8');
    runner.stderr.setEncoding('utf8');
    runner.stdout.on('data', (chunk) => {
        console.log(chunk);
    });
    process.stdin.pipe(runner.stdin);
    process.stdin.on('data', data => {
      if (data.toString().includes('r')) {
        runner.stdin.pause();
        runner.kill();
        console.log(chalk.blue('Conflict > ') + 'Refreshed');
        spawnRunner();
      }
    })

    runner.stderr.on('data', (chunk) => {
        console.error(chunk);
    });
    runner.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
    });
    process.stdin.on('end', (chunk) => {
      runner.stdin.pause();
      runner.kill();
      babel.stdin.pause();
      babel.kill();
    });
  }

  spawnRunner();
  
  console.log(chalk.blue('Conflict > ') + 'Development server started. Press r to refresh. Please use only Ctrl+C to exit.');
});