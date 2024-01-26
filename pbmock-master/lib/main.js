/** 
 * author:jacksonzeng
 * package:pbmock
 * last modified: Wed Nov 06 2019 14:19:43
 * */

const pbjs = require("protobufjs/cli/pbjs"); // or require("protobufjs/cli").pbjs / .pbts
const Mock = require('mockjs');
const path = require("path")
const util = require("./util.js")
const constants = require("./constants.js")

// 解析json结果
var common_result = null
var global_opts = {
  logger:true,
  disabled:false,
}

// namespaceStack 与messageStack同步 
// 每判断一个新的message 就会产生一个新的namespace与之对应
var namespaceStack = []
// message 解析栈
var messageStack = []

module.exports.config = global_opts

module.exports = function mocker(opts){
  let {
    cmd,
    entry,
    disabled,
    whiteList,
  } = opts

  let final_result = null

  // 拷贝一层opts到global_opts
  global_opts = Object.assign(global_opts,opts)

  if(disabled){
    util.logger({
        action:"TIPS",
        message:"pbmock has been disabled"
    })
    return
  }

  if(whiteList && whiteList instanceof Array &&
    !whiteList.includes(cmd) ){
        util.logger({
            action:"TIPS",
            message:`${cmd} does not exist in whiteList`
        })
        return
  }
  
  if(entry && typeof entry === "function"){
    // 判断如果entry为空，就默认为当前路径
    entry = entry.call(null,path)
  }

  if(global_opts.times){
      constants.TIMES = parseInt(global_opts.times) || 5
  }

  pbjs.main([ "--target", "json", entry], function(err, result) {
      if (err)
          throw err;
      //这里的result是一个json格式的返回值，与pbjs xxx.proto -t json > xxx.json生成的json文件格式一样

      // do something with result
      result = JSON.parse(result).nested//转为js对象，取里面的nested

      common_result = result;

      var namespaces = Object.keys(result);//获取result中的key，结果可能只有package的名字 假设package为xxx,则这里的key只有xxx，如果是xxx1.xxx2.xxx3 则这里只会拿到xxx1

      const checkCmd = `${namespaces[0]}.${cmd}`;
      util.logger({
          action:"findCmd",
          message:`Try to find cmd ${checkCmd}`
      })
      const currentSpace = namespaces[0];//这里的currentSpace 是xxx1
      
      // 找到入口
      // 初次进入 存储当前命名空间
      namespaceStack.push(namespaces[0])
      // 适配package:xxx1.xxx2.xxx3
      let curObj=getObject(currentSpace,cmd);

      var data= handleObject(curObj);
      // var data = handleObject(result[currentSpace].nested[cmd])
      namespaceStack.pop()

      //  接口钩子逻辑处理
      if(global_opts && global_opts.hook && global_opts.hook[cmd] 
        && util.isFunction(global_opts.hook[cmd]) ){
        global_opts.hook[cmd](data,Mock)
      }

      // 提供变量以及拦截函数 用于中间拦截
      if(global_opts.exposeVar && global_opts.intercept 
        && util.isFunction(global_opts.intercept)){
            global_opts.intercept.call(null,global_opts.exposeVar,data)
      }
      
      final_result = data
      return data

  });

  return final_result
}

 

function handleConfigureType(type){
    if(global_opts.configureType && global_opts.configureType[type]){
        let value = global_opts.configureType[type]
        if(value && typeof value === "function"){
            return value.call(null,Mock)
        }else{
            return value
        }
    }else{
        return null
    }
}


function getData(type){
  var value;
  switch(type){
    case "bool":
        value = handleConfigureType(type) || Mock.Random.boolean();
        break;
    case "double":
        value = handleConfigureType(type) || Mock.Random.float(0,100,3,3);
        break;
    case "float": 
        value = handleConfigureType(type) || Mock.Random.float(0,100,3,3);
        break;
    case "int32":
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "int64": 
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "uint32":
        value = handleConfigureType(type) || Mock.Random.integer(0,10000);
        break;
    case "uint64":
        value = handleConfigureType(type) || Mock.Random.integer(0,10000);
        break;
    case "sint32":
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "sint64":
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "fixed32":
        value = handleConfigureType(type) || Mock.Random.integer(0,10000);
        break;
    case "fixed64":
        value = handleConfigureType(type) || Mock.Random.integer(0,10000);
        break;
    case "sfixed32":
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "sfixed32":
        value = handleConfigureType(type) || Mock.Random.integer(-10000,10000);
        break;
    case "string":
        value = handleConfigureType(type) || Mock.Random.string(10);break;
    case "bytes":
        value = handleConfigureType(type) || Buffer.from(String(Mock.Random.integer(0,10)));
        break;
  }
  return value
}

function triggerFindAction({
  nested,
  handledQuote,
  findType
}){
  util.logger({
    action:"findMessage",
    message:`try to find ${handledQuote}`
  })
  let message = null
  try{
    message = eval(`nested.${handledQuote}`)
  }catch(e){
    util.logger({
      action:"findMessage",
      message:`find ${handledQuote} fail in ${findType}`
    })
  }
  if(!!message){
    util.logger({
      action:"findMessage",
      message:`find ${handledQuote} in ${findType} successfully`
    })
    // 每找到一个message 都更新栈内namespace
    if(findType === constants.findType.OTHER_PROTO){
        // 第一项为命名空间
        namespaceStack.push(handledQuote.split(".")[0])
    }else{
        namespaceStack.push(util.getStackTop(namespaceStack))
    }
  }
  return message
}

// 优先查找当前层级下nested，之后查找当前文件下nested，最后查找其他命名空间下nested
// 没有则报错
function findMessage(typeName){
  
  // find in current context
  let current_nested = util.getStackTop(messageStack).nested
  // message的查找可能找到其他proto文件下，namespace会发生变化 
  let global_nested = common_result[util.getStackTop(namespaceStack)].nested
  let other_namespaces = common_result
  let handledQuote = typeName.replace(/\./g,".nested.")

  return triggerFindAction({
    nested:current_nested,
    handledQuote:handledQuote,
    findType:constants.findType.CURRENT_MESSAGE
  }) || triggerFindAction({
    nested:global_nested,
    handledQuote:handledQuote,
    findType:constants.findType.CURRENT_PROTO
  }) || triggerFindAction({
    nested:other_namespaces,
    handledQuote:handledQuote,
    findType:constants.findType.OTHER_PROTO
  }) || new Error(`[Error]:cannot find ${handledQuote} in your proto file`)
}

function isReturnArray(rule){
  return rule === "repeated";
}

function callFunctionTimes(cb,times){
  let cb_result = []
  if(cb && typeof cb === "function"){
    for (let index = 0; index < times; index++) {
      cb_result.push(cb.call(null))
    }
  }
  return cb_result
}


// 一个类型中可能含有 values、fields、oneofs、extensions、nested嵌套别的类型
// 如果是extend 是没有以上字段的 只有type、id、extend。
// 一个field字段中 含有type、rule、keyType（如果为map型）、id、extend（extend类型时）、reserved
function handleObject (message){

    // 为枚举类型 直接随机返回任意枚举常量
    if(message.values && !message.fields){
      let keys = Object.keys(message.values)
      return message.values[keys[Mock.Random.integer(0,keys.length - 1)]]
    }

    // 扩展类型 忽略
    if(message.extend && !message.fields){
      util.logger({
        action:"warning",
        message:"unsporting with extend syntax in .proto "
      })
      return null
    }

    // 记录当前遍历的message对象
    messageStack.push(message)

    const newObject = {}
    for(let field in message.fields){

      // 如果为map类型 优先单独处理
      if(message.fields[field].keyType && message.fields[field].type){
       
        let sub_newObject = {}
        let key = util.isNormalValue(message.fields[field].keyType) && 
        getData(message.fields[field].keyType)
        

        let value = util.isNormalValue(message.fields[field].type) ?
        getData(message.fields[field].type):
        handleObject(findMessage(message.fields[field].type))
        // 每次处理完一个message 弹出一个namespace
        namespaceStack.pop()

        sub_newObject[key] = value
        newObject[field] = sub_newObject

      }else if(util.isNormalValue(message.fields[field].type)){
        // 判断是普通类型或用户自定义类型

        // 判断是否返回数组
        if(isReturnArray(message.fields[field].rule)){
          newObject[field] = callFunctionTimes(
            ()=>getData(message.fields[field].type),
            constants.TIMES
          )
        }else{
          newObject[field] = getData(message.fields[field].type)
        }

      }else{
        //用户自定义类型处理逻辑 

        // 判断是否返回数组
        let sub_message = findMessage(message.fields[field].type)
        if(isReturnArray(message.fields[field].rule)){
          newObject[field] = callFunctionTimes(
            ()=>handleObject(sub_message),
            constants.TIMES
          )
        }else{
          newObject[field] = handleObject(sub_message)
        }
        // 每次处理完一个message 弹出一个namespace
        namespaceStack.pop()
      }
    }

    // 存在oneofs属性 随机剔除属性
    if(message.oneofs){
      for(let prop in message.oneofs){
        util.deletePropRandom(newObject,message.oneofs[prop].oneof)
      }
    }
    messageStack.pop()
    return newObject

}

function getObject (currentSpace,cmd){
  // 这里支持 package是 xx1.xx2.xx3的形式
  let temp=common_result[currentSpace].nested;
  let keys=Object.keys(temp);
  // temp的结果：{ xxx2:{ nested: { xxx3: { nested:xxxxxxxx }}}}
  while(!temp[cmd]&&keys.length>=1){
    //如果匹配不到对应的对象且还有嵌套
    temp=temp[keys[0]].nested;
    keys=Object.keys(temp);
  }
  return temp;
}