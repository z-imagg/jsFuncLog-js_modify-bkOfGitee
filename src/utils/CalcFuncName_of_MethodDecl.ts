//[描述] 获取方法声明 的 函数名
import { MethodDeclaration } from "ts-morph";
import { getFuncStartLineNumAsFuncName } from "./Basic";

export function calcFuncName_of_MethodDecl(funcDecl:MethodDeclaration){
  if(!funcDecl){ throw new Error("此函数入参不应该为空,calcFuncName_of_MethodDecl")}

  const funcName_byLineNum:string=getFuncStartLineNumAsFuncName(funcDecl);
  //无可奈何时,返回用行号构造的函数名
  if(funcDecl.getChildCount()<=0){ return funcName_byLineNum;}

  const field=funcDecl.getChildAtIndex(0);
  //以字段名为函数名
  return  field.getText();
}//end_func calcFuncName_of_FuncExpr

