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

  // 注意：if 助手函数是 Handlebars 内置的，不需要重新注册
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
  try {
    let targetFileName = fileName;
    let shouldProcess = fileName.endsWith('.hbs');
    
    if (shouldProcess) {
      targetFileName = fileName.slice(0, -4);
      
      // 根据文件类型和选项添加正确的扩展名
      targetFileName = getCorrectFileExtension(targetFileName, data);
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
  } catch (error) {
    console.error('Error processing file', fileName, ':', error instanceof Error ? error.message : String(error));
    // 不再抛出错误，继续处理其他文件
  }
}

function getCorrectFileExtension(fileName: string, data: any): string {
  const { typescript, framework } = data;
  
  // React 文件扩展名处理
  if (framework === 'react') {
    if (fileName === 'App' || fileName === 'index') {
      return typescript ? `${fileName}.tsx` : `${fileName}.jsx`;
    }
    if (fileName.startsWith('pages/') || fileName.includes('Component')) {
      const baseName = fileName;
      return typescript ? `${baseName}.tsx` : `${baseName}.jsx`;
    }
    if (fileName.includes('styles/')) {
      const baseName = fileName;
      return typescript ? `${baseName}.scss` : `${baseName}.css`;
    }
  }
  
  // Vue 文件扩展名处理
  if (framework === 'vue') {
    if (fileName === 'main') {
      return typescript ? `${fileName}.ts` : `${fileName}.js`;
    }
    if (fileName === 'router/index') {
      return typescript ? `${fileName}.ts` : `${fileName}.js`;
    }
    if (fileName === 'styles/main') {
      return typescript ? `${fileName}.scss` : `${fileName}.css`;
    }
    // Vue 组件文件保持 .vue 扩展名
    if (fileName.endsWith('.vue')) {
      return fileName;
    }
  }
  
  return fileName;
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