import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { 
  validateProjectName, 
  checkDirectoryExists, 
  getAbsolutePath,
  ensureDir,
  getPackageManager
} from '../utils';
import { generateProject } from '../generator';
import { installDependencies } from '../installer';

export interface ProjectOptions {
  framework: 'react' | 'vue';
  version: string;
  typescript: boolean;
  router: boolean;
  qiankun: boolean;
  qiankunMode?: 'main' | 'micro';
  force?: boolean;
}

export async function createProject(projectName: string, cmdOptions: { force?: boolean } = {}) {
  const targetPath = getAbsolutePath(projectName);
  const projectDir = path.basename(targetPath);
  
  // 验证项目名称
  if (projectName !== '.' && !validateProjectName(projectDir)) {
    return;
  }

  // 检查目录是否存在
  if (checkDirectoryExists(targetPath) && !cmdOptions.force) {
    const { shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: `目录 ${chalk.cyan(targetPath)} 已存在且不为空。是否要覆盖？`,
        default: false
      }
    ]);

    if (!shouldContinue) {
      console.log(chalk.yellow('操作已取消'));
      return;
    }
  }

  // 获取项目配置
  const options = await getProjectOptions();
  
  console.log();
  console.log(`🚀 开始创建项目 ${chalk.cyan(projectDir)}`);
  console.log();

  try {
    // 创建项目目录
    ensureDir(targetPath);

    // 生成项目文件
    const spinner = ora('正在生成项目文件...').start();
    await generateProject(targetPath, projectDir, options);
    spinner.succeed('项目文件生成完成');

    // 安装依赖
    await installDependencies(targetPath, options);

    console.log();
    console.log(chalk.green('🎉 项目创建成功！'));
    console.log();
    console.log('请运行以下命令开始开发：');
    console.log();
    if (projectName !== '.') {
      console.log(chalk.cyan(`  cd ${projectDir}`));
    }
    
    const packageManager = getPackageManager();
    if (packageManager === 'npm') {
      console.log(chalk.cyan('  npm run dev'));
    } else if (packageManager === 'yarn') {
      console.log(chalk.cyan('  yarn dev'));
    } else {
      console.log(chalk.cyan('  pnpm dev'));
    }
    console.log();

  } catch (error) {
    console.error(chalk.red('创建项目时出错:'), error);
    throw error;
  }
}

async function getProjectOptions(): Promise<ProjectOptions> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: '请选择要使用的框架:',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue', value: 'vue' }
      ]
    }
  ]);

  // 根据选择的框架询问版本
  const versionAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: `请选择 ${answers.framework === 'react' ? 'React' : 'Vue'} 版本:`,
      choices: answers.framework === 'react' 
        ? [
            { name: 'React 18.x', value: '18' },
            { name: 'React 17.x', value: '17' },
            { name: 'React 16.x', value: '16' }
          ]
        : [
            { name: 'Vue 3.x', value: '3' },
            { name: 'Vue 2.x', value: '2' }
          ]
    }
  ]);

  const additionalOptions = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'typescript',
      message: '是否使用 TypeScript?',
      default: true
    },
    {
      type: 'confirm',
      name: 'router',
      message: `是否添加 ${answers.framework === 'react' ? 'React Router' : 'Vue Router'}?`,
      default: true
    },
    {
      type: 'confirm',
      name: 'qiankun',
      message: '是否集成 qiankun 微前端?',
      default: false
    }
  ]);

  let qiankunMode;
  if (additionalOptions.qiankun) {
    const modeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'qiankunMode',
        message: '请选择 qiankun 模式:',
        choices: [
          { name: '主应用 (Main App)', value: 'main' },
          { name: '微应用 (Micro App)', value: 'micro' }
        ]
      }
    ]);
    qiankunMode = modeAnswer.qiankunMode;
  }

  return {
    ...answers,
    ...versionAnswer,
    ...additionalOptions,
    qiankunMode
  };
}