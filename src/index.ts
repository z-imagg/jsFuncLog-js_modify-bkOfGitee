// 参考: https://juejin.cn/post/7213277254183845945
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,ClassDeclaration,FunctionDeclaration,ImportDeclaration,VariableDeclaration } from "ts-morph";

// 创建一个TypeScript项目对象
const project:Project = new Project();

// 从文件系统加载tsconfig.json文件，并将其中的所有源文件添加到项目中
// project.addSourceFilesAtPaths("/app2/WebCola/tsconfig.json");
project.addSourceFilesAtPaths("/app2/WebCola/WebCola/**/*.ts");


// 获取项目中的所有源文件
const sourceFiles:SourceFile[] = project.getSourceFiles();
console.log(`sourceFiles=${sourceFiles}`)

// 获取所有类名
const classNames:string[] = sourceFiles.flatMap((sourceFile:SourceFile) =>
  sourceFile.getClasses().map((classDecl:ClassDeclaration) => classDecl.getName())
);
console.log(`classNames=${classNames}`)

// 获取所有函数名
const functionNames = sourceFiles.flatMap((sourceFile:SourceFile) =>
  sourceFile.getFunctions().map((funcDecl:FunctionDeclaration) => funcDecl.getName())
);
console.log(`functionNames=${functionNames}`);

// 获取所有import语句
const importLs:ImportDeclaration[] = sourceFiles.flatMap((sourceFile:SourceFile) => sourceFile.getImportDeclarations());
importLs.forEach((importDecl:ImportDeclaration,k:number) => {
  console.log(`${k},importDecl,`,importDecl.getModuleSpecifierValue());
});

// 获取所有变量声明
const variables:VariableDeclaration[] = sourceFiles.flatMap((sourceFile:SourceFile) => sourceFile.getVariableDeclarations());
variables.forEach((variable:VariableDeclaration,k:number) => {
  console.log(`${k},variable,`,variable.getName());
});
