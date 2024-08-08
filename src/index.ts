// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,ClassDeclaration,FunctionDeclaration,ImportDeclaration,VariableDeclaration ,SyntaxKind,KindToNodeMappings,Statement,FunctionExpression,StandardizedFilePath} from "ts-morph";

// 创建一个TypeScript项目对象
const project:Project = new Project();

project.addSourceFilesAtPaths("/app2/WebCola/WebCola/**/*.ts");


// 获取项目中的所有源文件
const sourceFiles:SourceFile[] = project.getSourceFiles();
console.log(`sourceFiles=${sourceFiles}`)

const ignore_SrcFileLs:string[] = [/* "powergraphexample.ts","tmdbgraph.ts","vhybridize.ts","gridrouting.ts","routingtests.ts" */]
for (const srcFile of sourceFiles) {
  const fileBaseName:string=srcFile.getBaseName()
  const filePath:StandardizedFilePath=srcFile.getFilePath()
  if(ignore_SrcFileLs.includes(fileBaseName) || fileBaseName.includes("test")){ continue; }
  console.log(`文件名,fileBaseName=${fileBaseName}, filePath=${filePath}`)

  const actions: Array<() => void> = []
  // 获取源文件srcFile中匿名函数声明,   具体可观看 https://ts-ast-viewer.com/  解释x.ts 结果中的 FunctionExpression
  const funcDeclLs:FunctionExpression[] = srcFile.getDescendantsOfKind(SyntaxKind.FunctionExpression)

  //若空则跳过
  if(!funcDeclLs || funcDeclLs.length == 0 ){ continue;}
  
  // 把所有 修改动作 保存起来
    //遍历显函数声明
    for(const funcDecl of funcDeclLs){
      //取函数名
      let funcName:string|undefined=funcDecl.getName()
      if(!funcName){ funcName=""; }
      const startLnNum:number=funcDecl.getStartLineNumber();
      const endLnNum:number=funcDecl.getEndLineNumber();
      if(endLnNum==startLnNum){ continue;}
      console.log(`funcName=${funcName},起止行号 ${startLnNum}:${endLnNum}`)

      //忽略无函数体的函数
      if(!funcDecl.getBody()){ continue;}

      //获取函数的语句列表
      const stmts:Statement[]=funcDecl.getStatements()
      //忽略无语句的函数
      if(!stmts || stmts.length==0){ continue;}

      //取函数第一条语句
      const stmt0:Statement=stmts[0]
      //忽略第一条语句为空的函数
      if(!stmt0){ continue;}

      // [遵守规则] 一个动作必须只能含有一个修改源码文本行为; 
      //     若一个动作含有多个修改源码文本行为, 则修改1 可能印象修改2 的执行背景,从而导致修改2报错  (InvalidOperationError: Attempted to get information from a node that was removed or forgotten.)
      actions.unshift(() => {

          //在函数第一条语句前添加注释
          stmt0.replaceWithText(`/*匿名函数${funcName}第一条语句前加注释*/${stmt0.getText()}`)
      })//end_unshift

}//end_for
  
  // 最后 一并执行 修改动作
  actions.forEach((act) => {
    act()
  })//end_forEach

}//end_for

//保存项目
project.saveSync()