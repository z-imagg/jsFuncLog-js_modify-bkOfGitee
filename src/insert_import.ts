// [描述] 对 WebCola/**.ts文件开头 插入 import语句

// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,ClassDeclaration,FunctionDeclaration,ImportDeclaration,VariableDeclaration ,SyntaxKind,KindToNodeMappings,Statement,FunctionExpression,StandardizedFilePath} from "ts-morph";

// 创建一个TypeScript项目对象
const project:Project = new Project();

project.addSourceFilesAtPaths("/app2/WebCola/WebCola/**/*.ts");


// 获取项目中的所有源文件
const sourceFiles:SourceFile[] = project.getSourceFiles();
console.log(`sourceFiles=${sourceFiles}`)


for (const srcFile of sourceFiles) {
  const fileBaseName:string=srcFile.getBaseName()
  const filePath:StandardizedFilePath=srcFile.getFilePath()
  console.log(`文件名,fileBaseName=${fileBaseName}, filePath=${filePath}`)
  const startPosition:number=srcFile.getStart()

  const importText:string=`import {_func_enter_log,_funcNoArgs_enter_log,_func_return_log,_funcNoArgs_return_log,_funcNoArgs_noReturn_log,_func_noReturn_log} from 'js_func_log'; const _srcFilePath/* :string */='${filePath}';`

  const actions: Array<() => void> = []

  // [遵守规则] 一个动作必须只能含有一个修改源码文本行为; 
  //     若一个动作含有多个修改源码文本行为, 则修改1 可能印象修改2 的执行背景,从而导致修改2报错  (InvalidOperationError: Attempted to get information from a node that was removed or forgotten.)
  actions.unshift(() => {

    //在文件开头添加import语句
    srcFile.insertText(startPosition, `${importText};`)
  })//end_unshift

  
  // 最后 一并执行 修改动作
  actions.forEach((act) => {
    act()
  })//end_forEach

}//end_for

//保存项目
project.saveSync()