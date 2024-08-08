// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,ClassDeclaration,FunctionDeclaration,ImportDeclaration,VariableDeclaration ,SyntaxKind,KindToNodeMappings} from "ts-morph";

// 创建一个TypeScript项目对象
const project:Project = new Project();

project.addSourceFilesAtPaths("/app2/WebCola/WebCola/**/*.ts");


// 获取项目中的所有源文件
const sourceFiles:SourceFile[] = project.getSourceFiles();
console.log(`sourceFiles=${sourceFiles}`)

for (const srcFile of sourceFiles) {
  const actions: Array<() => void> = []
  // 获取源文件srcFile中第一个变量声明
  const singleNode:KindToNodeMappings[SyntaxKind.VariableDeclaration]|undefined = srcFile.getFirstDescendantByKind(SyntaxKind.VariableDeclaration)

  //若空则跳过
  if(!singleNode){ continue;}
  
  // 把所有 修改动作 保存起来
  actions.unshift(() => {
    singleNode.replaceWithText('{ hello: 1, world: 2 }')
  })
  
  // 最后 一并执行 修改动作
  actions.forEach((act) => {
    act()
  })
}

//保存项目
project.saveSync()