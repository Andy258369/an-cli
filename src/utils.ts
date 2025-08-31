import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import validateNpmName from 'validate-npm-package-name';

/**
 * 验证项目名称是否合法
 */
export function validateProjectName(name: string): boolean {
  const validation = validateNpmName(name);
  if (!validation.validForNewPackages) {
    console.error(chalk.red(`项目名称 "${name}" 不合法:`));
    validation.errors?.forEach(error => {
      console.error(chalk.red(`  - ${error}`));
    });
    validation.warnings?.forEach(warning => {
      console.error(chalk.yellow(`  - ${warning}`));
    });
    return false;
  }
  return true;
}

/**
 * 检查目录是否存在且非空
 */
export function checkDirectoryExists(dir: string): boolean {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    return files.length > 0;
  }
  return false;
}

/**
 * 获取绝对路径
 */
export function getAbsolutePath(targetPath: string): string {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(process.cwd(), targetPath);
}

/**
 * 确保目录存在
 */
export function ensureDir(dir: string): void {
  fs.ensureDirSync(dir);
}

/**
 * 复制文件或目录
 */
export async function copyTemplate(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest);
}

/**
 * 写入文件
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * 读取JSON文件
 */
export async function readJsonFile(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入JSON文件
 */
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * 获取包管理器类型
 */
export function getPackageManager(): 'npm' | 'yarn' | 'pnpm' {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.includes('yarn')) return 'yarn';
    if (userAgent.includes('pnpm')) return 'pnpm';
  }
  return 'npm';
}