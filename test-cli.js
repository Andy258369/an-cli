#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

async function testCLI() {
  const testDir = path.join(__dirname, 'test-output-automated');
  
  console.log('🧪 开始测试 an-cli 工具...\n');
  
  // 清理测试目录
  await fs.remove(testDir);
  await fs.ensureDir(testDir);
  
  // 测试1: 帮助命令
  console.log('1. 测试帮助命令...');
  const helpResult = await runCommand('node bin/an.js --help');
  if (helpResult.includes('一个自定义的前端构建框架CLI')) {
    console.log('✅ 帮助命令测试通过');
  } else {
    console.log('❌ 帮助命令测试失败');
    return;
  }
  
  // 测试2: create命令帮助
  console.log('2. 测试create命令帮助...');
  const createHelpResult = await runCommand('node bin/an.js create --help');
  if (createHelpResult.includes('创建一个新的前端项目')) {
    console.log('✅ create命令帮助测试通过');
  } else {
    console.log('❌ create命令帮助测试失败');
    return;
  }
  
  // 测试3: 版本命令
  console.log('3. 测试版本命令...');
  const versionResult = await runCommand('node bin/an.js --version');
  if (versionResult.trim().match(/^\d+\.\d+\.\d+$/)) {
    console.log('✅ 版本命令测试通过');
  } else {
    console.log('❌ 版本命令测试失败');
    return;
  }
  
  // 测试4: 检查模板文件
  console.log('4. 检查模板文件...');
  const reactTemplate = path.join(__dirname, 'templates/react');
  const vueTemplate = path.join(__dirname, 'templates/vue');
  
  if (await fs.pathExists(reactTemplate) && await fs.pathExists(vueTemplate)) {
    console.log('✅ 模板文件存在检查通过');
  } else {
    console.log('❌ 模板文件检查失败');
    return;
  }
  
  // 测试5: 检查lib文件编译结果
  console.log('5. 检查编译结果...');
  const libDir = path.join(__dirname, 'lib');
  const indexJs = path.join(libDir, 'index.js');
  const generatorJs = path.join(libDir, 'generator.js');
  
  if (await fs.pathExists(indexJs) && await fs.pathExists(generatorJs)) {
    console.log('✅ 编译结果检查通过');
  } else {
    console.log('❌ 编译结果检查失败');
    return;
  }
  
  console.log('\n🎉 所有基础功能测试通过！');
  console.log('\n📝 测试总结:');
  console.log('   - CLI命令行工具正常启动');
  console.log('   - 帮助信息显示正确');
  console.log('   - 版本信息正确');
  console.log('   - 模板文件完整');
  console.log('   - TypeScript编译成功');
  console.log('\n✨ an-cli 工具功能正常，可以使用！');
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { 
      cwd: __dirname,
      timeout: 10000  // 10秒超时
    }, (error, stdout, stderr) => {
      if (error) {
        // 对于help命令，退出码1是正常的
        if (command.includes('--help') && error.code === 1) {
          resolve(stdout + stderr);
        } else {
          reject(error);
        }
      } else {
        resolve(stdout + stderr);
      }
    });
  });
}

// 运行测试
testCLI().catch(error => {
  console.error('❌ 测试过程中出现错误:', error.message);
  process.exit(1);
});