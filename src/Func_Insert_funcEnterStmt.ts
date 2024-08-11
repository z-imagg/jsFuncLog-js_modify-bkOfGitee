// [描述] 对 WebCola/**.ts 匿名函数开头 插入 函数进入语句文本

// 参考: https://gist.github.com/banyudu/cf5a6c8ff4b6c8acec97a5517c0fa583
// ts-ast在线解析  https://ts-ast-viewer.com/

import { Project,SourceFile,SyntaxKind,Statement,FunctionExpression, KindToNodeMappings, MethodDeclaration, FunctionDeclaration} from "ts-morph";
import { calcFuncName_of_FuncExpr } from "./utils/GetFuncName_of_FuncExpr";
import {calcFuncName_of_MethodOrFuncDecl} from "./utils/CalcFuncName_of_MethodOrFuncDecl"
import { get_firstStmt_of_Func } from "./func_process/FunctionExpression_Process";

import { Dexie } from 'dexie';
import {importDB, exportDB, importInto, peakImportFile} from "dexie-export-import";

async function xxx(){
  const existed=await Dexie.exists('FriendDatabase')
  if(existed){
    await Dexie.delete('FriendDatabase')
  }
  const db_FuncLog = new Dexie('FriendDatabase');
  db_FuncLog.version(1).stores({
    friends: '++id, age'
  });
  db_FuncLog.table("tab_funcLog").count().then(c=>{console.log(c)})
  db_FuncLog.delete()
  
}


//调用入口函数
main_insertFuncEnterStmt()

//执行修改动作 所需要的材料
interface ModifyMaterial{
  //函数的第一条语句
  stmt0:Statement|undefined
  //函数名
  funcName:string
}//end_interface ModifyMaterial

//执行修改动作
function execModifyAction(mat:ModifyMaterial){
  //跳过无第一条语句的函数
  if(!mat.stmt0){ return;}
  //构造日志语句
  const 函数进入语句文本:string=`  const _funcName/* :string */='${mat.funcName}' ; _funcNoArgs_enter_log(_srcFilePath,_funcName ) ; `
  //在函数第一条语句前添加 日志语句
  mat.stmt0.replaceWithText(`${函数进入语句文本} ; ${mat.stmt0.getText()}`)
}//end_func execModifyAction

//计算 函数名
function calcFuncName_of_Func<T_FuncDecl>(funcDecl:T_FuncDecl, funcDeclTypeEnum:SyntaxKind):string|undefined{
  if(funcDeclTypeEnum==SyntaxKind.FunctionDeclaration){
    return calcFuncName_of_MethodOrFuncDecl(funcDecl as FunctionDeclaration)
  }
  if(funcDeclTypeEnum==SyntaxKind.FunctionExpression){
    return calcFuncName_of_FuncExpr(funcDecl as FunctionExpression)
  }
  if(funcDeclTypeEnum==SyntaxKind.MethodDeclaration){
    return calcFuncName_of_MethodOrFuncDecl(funcDecl as MethodDeclaration)
  }
  return undefined;
}//end_func calcFuncName_of_Func

//获取函数的第一条语句
function get_firstStmt_of_Func_wrap<T_FuncDecl>(funcDecl:T_FuncDecl, funcDeclTypeEnum:SyntaxKind):Statement|undefined{
  if(funcDeclTypeEnum==SyntaxKind.FunctionDeclaration){
    return get_firstStmt_of_Func(funcDecl as FunctionDeclaration)
  }
  if(funcDeclTypeEnum==SyntaxKind.FunctionExpression){
    return get_firstStmt_of_Func(funcDecl as FunctionExpression)
  }
  if(funcDeclTypeEnum==SyntaxKind.MethodDeclaration){
    return get_firstStmt_of_Func(funcDecl as MethodDeclaration)
  }
  return undefined;
}//end_func get_firstStmt_of_Func

//入口函数, 插入函数进入语句
function main_insertFuncEnterStmt(){
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

  console.log(`文件名,fileBaseName=${fileBaseName}, filePath=${filePath}, SyntaxKind.FunctionExpression=${SyntaxKind.FunctionExpression},SyntaxKind.MethodDeclaration=${SyntaxKind.MethodDeclaration}`)

  //0. 显函数
  const materialLs_FnDecl:Array<ModifyMaterial>|undefined =  srcFile_process<FunctionExpression,SyntaxKind.FunctionDeclaration>(srcFile,SyntaxKind.FunctionDeclaration)
  if(materialLs_FnDecl ){ 
    // 最后 一并执行 修改动作
    materialLs_FnDecl.forEach((mat)=>execModifyAction(mat))
  }

  //1. 匿名函数
  const materialLs_FnExpr:Array<ModifyMaterial>|undefined =  srcFile_process<FunctionExpression,SyntaxKind.FunctionExpression>(srcFile,SyntaxKind.FunctionExpression)
  if(materialLs_FnExpr ){ 
    // 最后 一并执行 修改动作
    materialLs_FnExpr.forEach((mat)=>execModifyAction(mat))
  }

  //2. 方法
  const materialLs_MtdDecl:Array<ModifyMaterial>|undefined =  srcFile_process<MethodDeclaration,SyntaxKind.MethodDeclaration>(srcFile,SyntaxKind.MethodDeclaration)
  if(materialLs_MtdDecl ){ 
    // 最后 一并执行 修改动作
    materialLs_MtdDecl.forEach((mat)=>execModifyAction(mat))
  }

}//end_for 源文件遍历

//保存项目
project.saveSync()
}//end_func main函数


//FMD==Function or Method Declare
function srcFile_process<T_FMD,SK_FMD extends SyntaxKind>(srcFile:SourceFile,  funcDeclTypeEnum:SK_FMD):Array<ModifyMaterial>|undefined{
  //函数多于4行代码, 才会被关注
  const mini_func_line_count:number = 4;

//SK_FMD 举例 SyntaxKind.FunctionExpression
//ts这里有点怪味道,  SyntaxKind.FunctionExpression 是 enum SyntaxKind 的一个具体整数值, 但 又可以说 SyntaxKind.FunctionExpression extends SyntaxKind ? 

  const materialLs:Array<ModifyMaterial> = []

  // 获取源文件srcFile中匿名函数声明,   具体可观看 https://ts-ast-viewer.com/  解释x.ts 结果中的 FunctionExpression
  const funcDeclLs: KindToNodeMappings[SK_FMD][] /* FunctionExpression[] */ = srcFile.getDescendantsOfKind (funcDeclTypeEnum)//funcDeclTypeEnum比如 SyntaxKind.FunctionExpression
  //funcDeclLs: (FunctionExpression|MethodDeclaration)[]

  //若空则跳过
  if(!funcDeclLs || funcDeclLs.length == 0 ){ return undefined;}
  
  // 把所有 修改动作 保存起来
  //遍历匿名函数声明
  for(const funcDecl of funcDeclLs){//funcDecl: FunctionExpression|MethodDeclaration
    //取函数名
    let funcName:string =calcFuncName_of_Func<T_FMD>(funcDecl as T_FMD,funcDeclTypeEnum)
    const stmt0:Statement|undefined=get_firstStmt_of_Func_wrap<T_FMD>(funcDecl as T_FMD,funcDeclTypeEnum)
    const funcStartLnNum:number=funcDecl.getStartLineNumber()
    const funcEndLnNum:number=funcDecl.getEndLineNumber()
    const funcLnCnt:number = funcEndLnNum - funcStartLnNum;
    //跳过 代码行数太少 的 函数 
    if(funcLnCnt < mini_func_line_count){ continue;}
    //忽略起止行号相同的函数,忽略无函数体的函数,忽略无语句的函数,忽略第一条语句为空的函数
    console.log(`funcName=${funcName},起止行号 ${funcStartLnNum}:${funcEndLnNum},忽略么?${stmt0==undefined}, funcDeclTypeEnum=${funcDeclTypeEnum}`)
    if(!stmt0){ continue;}

    // [遵守规则] 一个动作必须只能含有一个修改源码文本行为; 
    //     若一个动作含有多个修改源码文本行为, 则修改1 可能印象修改2 的执行背景,从而导致修改2报错  (InvalidOperationError: Attempted to get information from a node that was removed or forgotten.)
    materialLs.unshift(<ModifyMaterial>{funcName,stmt0})

  }//end_for 函数声明遍历

  return materialLs;
}//end_func srcFile_process
