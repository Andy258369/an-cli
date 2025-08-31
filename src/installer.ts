import execa from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { getPackageManager } from './utils';
import { ProjectOptions } from './commands/create';

export async function installDependencies(projectPath: string, options: ProjectOptions): Promise<void> {
  const packageManager = getPackageManager();
  
  const spinner = ora({
    text: `正在使用 ${packageManager} 安装依赖...`,
    color: 'blue'
  }).start();

  try {
    let installCommand: string[];
    
    if (packageManager === 'yarn') {
      installCommand = ['yarn', 'install'];
    } else if (packageManager === 'pnpm') {
      installCommand = ['pnpm', 'install'];
    } else {
      installCommand = ['npm', 'install'];
    }

    await execa(installCommand[0], installCommand.slice(1), {
      cwd: projectPath,
      stdio: 'pipe'
    });

    spinner.succeed(`依赖安装完成 (使用 ${packageManager})`);
  } catch (error: any) {
    spinner.fail(`依赖安装失败`);
    console.error(chalk.red('安装错误:'), error.message);
    console.log();
    console.log(chalk.yellow('你可以稍后手动安装依赖：'));
    console.log(chalk.cyan(`  cd ${projectPath.split('/').pop()}`));
    
    if (packageManager === 'yarn') {
      console.log(chalk.cyan('  yarn install'));
    } else if (packageManager === 'pnpm') {
      console.log(chalk.cyan('  pnpm install'));
    } else {
      console.log(chalk.cyan('  npm install'));
    }
    
    throw error;
  }
}