const { spawn } = require('child_process');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'inherit', ...options });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
    });
  });
}

async function installAndStart() {
  try {
    console.log('Installing dependencies in root...');
    await runCommand('npm', ['install'],{ cwd: './Backend' });

    console.log('Installing dependencies in frontend...');
    await runCommand('npm', ['install'], { cwd: './Frontend' });

    console.log('Starting backend and frontend servers...');

    const backend = spawn('node', ['Backend/things/index'], { stdio: 'inherit' });
    const frontend = spawn('npm', ['run', 'dev', '--prefix', './frontend'], { stdio: 'inherit' });

    const handleExit = () => {
      backend.kill();
      frontend.kill();
      process.exit();
    };

    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
  } catch (err) {
    console.error('Error during install or start:', err);
    process.exit(1);
  }
}

installAndStart();
