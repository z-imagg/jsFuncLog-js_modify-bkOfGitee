// [描述] 对 WebCola/**.ts 匿名函数开头 插入 函数进入语句文本

// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,SyntaxKind,Statement,FunctionExpression,MethodDeclaration} from "ts-morph";
import { calcFuncName_of_FuncExpr } from "./utils/GetFuncName";
import { get_firstStmt_of_FunctionExpression } from "./func_process/FunctionExpression_Process";

//执行修改动作 所需要的材料
interface ModifyMaterial{
  //函数的第一条语句
  stmt0:Statement|undefined
  //函数名
  funcName:string
}
//执行修改动作
function execModifyAction(mat:ModifyMaterial){
  //跳过无第一条语句的函数
  if(!mat.stmt0){ return;}
  //构造日志语句
  const 函数进入语句文本:string=`  const _funcName/* :string */='${mat.funcName}' ; _funcNoArgs_enter_log(_srcFilePath,_funcName ) ; `
  //在函数第一条语句前添加 日志语句
  mat.stmt0.replaceWithText(`${函数进入语句文本} ; ${mat.stmt0.getText()}`)
}

function calcFuncName_of_Func<T_FuncDecl>(funcDecl:T_FuncDecl, funcDeclTypeEnum:SyntaxKind):string|undefined{
  if(funcDeclTypeEnum==SyntaxKind.FunctionExpression){
    return calcFuncName_of_FuncExpr(funcDecl as FunctionExpression)
  }
  if(funcDeclTypeEnum==SyntaxKind.MethodDeclaration){
    // return calcFuncName_of_MethodDecl(funcDecl as MethodDeclaration)
  }
  return undefined;
}
function get_firstStmt_of_Func<T_FuncDecl>(funcDecl:T_FuncDecl, funcDeclTypeEnum:SyntaxKind):Statement|undefined{
  if(funcDeclTypeEnum==SyntaxKind.FunctionExpression){
    return get_firstStmt_of_FunctionExpression(funcDecl as FunctionExpression)
  }
  if(funcDeclTypeEnum==SyntaxKind.MethodDeclaration){
    // return get_firstStmt_of_MethodDecl(funcDecl as MethodDeclaration)
  }
  return undefined;
}
const focuse_srcF_prefix:string="/app2/WebCola/WebCola/src";
// 创建一个TypeScript项目对象
const project:Project = new Project();

project.addSourceFilesAtPaths("/app2/WebCola/WebCola/**/*.ts");


// 获取项目中的所有源文件
const sourceFiles:SourceFile[] = project.getSourceFiles();
console.log(`sourceFiles=${sourceFiles}`)

for (const srcFile of sourceFiles) {
  const fileBaseName:string=srcFile.getBaseName()
  const filePath=srcFile.getFilePath()
  //关注么?
  if(!filePath.startsWith(focuse_srcF_prefix)){ continue;}

  console.log(`文件名,fileBaseName=${fileBaseName}, filePath=${filePath}`)

  const materialLs:Array<ModifyMaterial> = []

  // 获取源文件srcFile中匿名函数声明,   具体可观看 https://ts-ast-viewer.com/  解释x.ts 结果中的 FunctionExpression
  const funcDeclLs:FunctionExpression[] = srcFile.getDescendantsOfKind(SyntaxKind.FunctionExpression)

  //若空则跳过
  if(!funcDeclLs || funcDeclLs.length == 0 ){ continue;}
  
  // 把所有 修改动作 保存起来
  //遍历匿名函数声明
  for(const funcDecl of funcDeclLs){
    //取函数名
    let funcName:string =calcFuncName_of_Func<FunctionExpression>(funcDecl,SyntaxKind.FunctionExpression)
    const stmt0:Statement|undefined=get_firstStmt_of_Func<FunctionExpression>(funcDecl,SyntaxKind.FunctionExpression)
    //忽略起止行号相同的函数,忽略无函数体的函数,忽略无语句的函数,忽略第一条语句为空的函数
    console.log(`funcName=${funcName},起止行号 ${funcDecl.getStartLineNumber()}:${funcDecl.getEndLineNumber()},忽略么?${stmt0==undefined}`)
    if(!stmt0){ continue;}

    // [遵守规则] 一个动作必须只能含有一个修改源码文本行为; 
    //     若一个动作含有多个修改源码文本行为, 则修改1 可能印象修改2 的执行背景,从而导致修改2报错  (InvalidOperationError: Attempted to get information from a node that was removed or forgotten.)
    materialLs.unshift(<ModifyMaterial>{funcName,stmt0})

  }//end_for 函数声明遍历
  
  // 最后 一并执行 修改动作
  materialLs.forEach((mat)=>execModifyAction(mat))

}//end_for 源文件遍历

//保存项目
project.saveSync()