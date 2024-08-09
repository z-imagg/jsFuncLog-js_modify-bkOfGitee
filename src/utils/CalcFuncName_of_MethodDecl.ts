//[描述] 获取方法声明 的 函数名
import { MethodDeclaration } from "ts-morph";
import { getFuncStartLineNumAsFuncName } from "./Basic";

export function calcFuncName_of_MethodDecl(methodDecl:MethodDeclaration){
  if(!methodDecl){ throw new Error("此函数入参不应该为空,calcFuncName_of_MethodDecl")}

  const funcName_byLineNum:string=getFuncStartLineNumAsFuncName(methodDecl);
  //无可奈何时,返回用行号构造的函数名
  if(methodDecl.getChildCount()<=0){ return funcName_byLineNum;}

  const field=methodDecl.getChildAtIndex(0);
  //以字段名为函数名
  return  field.getText();
}//end_func calcFuncName_of_FuncExpr

