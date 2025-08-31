#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/create';

const packageJson = require('../package.json');
const version = packageJson.version;

const program = new Command();

program
  .name('an')
  .description('一个自定义的前端构建框架CLI')
  .version(version);

program
  .command('create <project-name>')
  .description('创建一个新的前端项目')
  .option('-f, --force', '强制覆盖已存在的目录')
  .action(async (projectName: string, options: { force?: boolean }) => {
    try {
      await createProject(projectName, options);
    } catch (error: any) {
      console.error(chalk.red('错误:', error.message));
      process.exit(1);
    }
  });

program
  .command('init')
  .description('在当前目录初始化项目')
  .option('-f, --force', '强制覆盖已存在的文件')
  .action(async (options: { force?: boolean }) => {
    try {
      await createProject('.', options);
    } catch (error: any) {
      console.error(chalk.red('错误:', error.message));
      process.exit(1);
    }
  });

// 未知命令处理
program.on('command:*', () => {
  console.error(chalk.red(`未知命令: ${program.args.join(' ')}`));
  console.log(`运行 ${chalk.cyan('an --help')} 查看可用命令`);
  process.exit(1);
});

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供参数，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}