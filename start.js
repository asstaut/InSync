const { spawn } = require('child_process');
const path = require('path');

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
    console.log('Installing dependencies in backend...');
    await runCommand('npm', ['install'], { cwd: path.resolve(__dirname, 'Backend') });

    console.log('Installing dependencies in frontend...');
    await runCommand('npm', ['install'], { cwd: path.resolve(__dirname, 'Frontend') });

    console.log('Starting backend and frontend servers...');

    const backendCwd = path.resolve(__dirname, 'Backend', 'things');
    const frontendCwd = path.resolve(__dirname, 'Frontend');

    const backend = spawn('nodemon', ['index.js'], { stdio: 'inherit', cwd: backendCwd });
    const frontend = spawn('npm', ['run', 'dev'], { stdio: 'inherit', cwd: frontendCwd });

    backend.on('error', (err) => console.error('Backend spawn error:', err));
    backend.on('exit', (code) => {
      console.log(`Backend process exited with code ${code}`);
      frontend.kill();
      process.exit(code);
    });

    frontend.on('error', (err) => console.error('Frontend spawn error:', err));
    frontend.on('exit', (code) => {
      console.log(`Frontend process exited with code ${code}`);
      backend.kill();
      process.exit(code);
    });

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
