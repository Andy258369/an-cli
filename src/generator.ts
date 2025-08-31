import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import { ProjectOptions } from './commands/create';
import { writeFile, copyTemplate, writeJsonFile } from './utils';

export async function generateProject(
  targetPath: string, 
  projectName: string, 
  options: ProjectOptions
): Promise<void> {
  const templatePath = path.join(__dirname, '../templates', options.framework);
  
  // 注册 Handlebars 助手函数
  registerHandlebarsHelpers();
  
  // 生成模板数据
  const templateData = {
    projectName,
    ...options,
    reactVersion: options.framework === 'react' ? options.version : undefined,
    vueVersion: options.framework === 'vue' ? options.version : undefined,
  };

  // 复制和处理模板文件
  await processTemplateDirectory(templatePath, targetPath, templateData);
}

function registerHandlebarsHelpers() {
  // 注册 eq 助手函数用于比较
  handlebars.registerHelper('eq', function (a: any, b: any) {
    return a === b;
  });

  // 注册 if 条件助手
  handlebars.registerHelper('if', function (this: any, conditional: any, options: any) {
    if (conditional) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
}

async function processTemplateDirectory(
  templateDir: string, 
  targetDir: string, 
  data: any
): Promise<void> {
  const files = await fs.readdir(templateDir);
  
  for (const file of files) {
    const templateFilePath = path.join(templateDir, file);
    const stat = await fs.stat(templateFilePath);
    
    if (stat.isDirectory()) {
      // 递归处理目录
      const targetSubDir = path.join(targetDir, file);
      await fs.ensureDir(targetSubDir);
      await processTemplateDirectory(templateFilePath, targetSubDir, data);
    } else {
      // 处理文件
      await processTemplateFile(templateFilePath, targetDir, file, data);
    }
  }
}

async function processTemplateFile(
  templateFilePath: string, 
  targetDir: string, 
  fileName: string, 
  data: any
): Promise<void> {
  let targetFileName = fileName;
  let shouldProcess = true;
  
  // 处理文件名中的模板变量
  if (fileName.includes('{{')) {
    const template = handlebars.compile(fileName);
    targetFileName = template(data);
    
    // 如果处理后的文件名为空，跳过此文件
    if (!targetFileName.trim()) {
      return;
    }
  }
  
  // 移除 .hbs 扩展名
  if (targetFileName.endsWith('.hbs')) {
    targetFileName = targetFileName.slice(0, -4);
    shouldProcess = true;
  } else {
    shouldProcess = false;
  }
  
  const targetFilePath = path.join(targetDir, targetFileName);
  
  if (shouldProcess) {
    // 读取模板文件内容并处理
    const templateContent = await fs.readFile(templateFilePath, 'utf-8');
    
    // 检查是否需要根据条件跳过此文件
    if (shouldSkipFile(templateContent, data)) {
      return;
    }
    
    const template = handlebars.compile(templateContent);
    const processedContent = template(data);
    
    // 确保目标目录存在
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.writeFile(targetFilePath, processedContent, 'utf-8');
  } else {
    // 直接复制文件
    await fs.ensureDir(path.dirname(targetFilePath));
    await fs.copy(templateFilePath, targetFilePath);
  }
}

function shouldSkipFile(content: string, data: any): boolean {
  // 检查文件内容中的条件注释
  const conditionalRegex = /{{#if\s+(\w+)}}[\s\S]*?{{\/if}}/g;
  let match;
  
  while ((match = conditionalRegex.exec(content)) !== null) {
    const condition = match[1];
    if (!data[condition]) {
      // 如果整个文件都在条件块中且条件为false，则跳过文件
      const withoutConditional = content.replace(conditionalRegex, '').trim();
      if (!withoutConditional) {
        return true;
      }
    }
  }
  
  return false;
}

export async function generatePackageJson(
  targetPath: string, 
  projectName: string, 
  options: ProjectOptions
): Promise<void> {
  const templatePath = path.join(__dirname, '../templates', options.framework, 'package.json.hbs');
  
  if (await fs.pathExists(templatePath)) {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    
    const templateData = {
      projectName,
      ...options,
      reactVersion: options.framework === 'react' ? options.version : undefined,
      vueVersion: options.framework === 'vue' ? options.version : undefined,
    };
    
    const packageJsonContent = template(templateData);
    const packageJsonPath = path.join(targetPath, 'package.json');
    
    await fs.writeFile(packageJsonPath, packageJsonContent, 'utf-8');
  }
}