import { MethodDeclaration } from "ts-morph";
import { FunctionExpression } from "ts-morph";


//以行号 给 匿名函数取名
export function getFuncStartLineNumAsFuncName(funcDecl:FunctionExpression|MethodDeclaration):string{
  const startLnNum:number=funcDecl.getStartLineNumber();
  // const endLnNum:number=funcDecl.getEndLineNumber();
  const funcName=`匿名函数@行号${startLnNum}`;
  return funcName;
}//end_func getFuncStartLineNumAsFuncName
