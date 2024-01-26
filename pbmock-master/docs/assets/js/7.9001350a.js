(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{205:function(t,a,e){"use strict";e.r(a);var s=e(0),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"pbmock"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#pbmock"}},[t._v("#")]),t._v(" pbmock")]),t._v(" "),e("h3",{attrs:{id:"以前的痛点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#以前的痛点"}},[t._v("#")]),t._v(" 以前的痛点")]),t._v(" "),e("p",[t._v("1、联调开发阻塞，前端只能自己手写假数据\n2、长短文本、空数据等测试不全面\n3、需求周期结束后，其他人接受，发现再无数据，没有测试号？测试号没数据？debug痛苦，还要找后台配置假数据。")]),t._v(" "),e("h3",{attrs:{id:"pbmock所做的工作"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#pbmock所做的工作"}},[t._v("#")]),t._v(" pbmock所做的工作")]),t._v(" "),e("p",[t._v("1、解析pb协议，自动生成mock数据\n2、支持pb协议多种字段类型，嵌套message、enum等，基本覆盖所有语法。（暂不支持extend）\n3、丰富的配置项，允许用户对响应数据做额外配置")]),t._v(" "),e("h3",{attrs:{id:"getting-started"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#getting-started"}},[t._v("#")]),t._v(" Getting started")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("tnpm install @tencent/pbmock --save-dev\n")])])]),e("h3",{attrs:{id:"usage"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#usage"}},[t._v("#")]),t._v(" Usage")]),t._v(" "),e("p",[t._v("quick start:")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('\nconst mocker = require("pbmock")\nvar data = mocker({\n    cmd:"GetUserDataReq",\n    entry:path=>path.resolve(__dirname,"./pb/admin.proto"),\n}) \n\n// return data \n\n')])])]),e("h3",{attrs:{id:"options"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#options"}},[t._v("#")]),t._v(" Options")]),t._v(" "),e("h4",{attrs:{id:"cmd-：-string"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#cmd-：-string"}},[t._v("#")]),t._v(" cmd ： string")]),t._v(" "),e("p",[t._v("pb文件中需要查找的命令字，如果你需要动态mock命令字的话，可以这样使用：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("mocker({\n    cmd:`${request.query.path}Rsp`,\n    ...\n})\n")])])]),e("h4",{attrs:{id:"entry-：-string-function"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#entry-：-string-function"}},[t._v("#")]),t._v(" entry ： string | function")]),t._v(" "),e("p",[t._v("指定入口pb文件，允许提供字符串或函数，若为字符串请提供绝对路径。")]),t._v(" "),e("h4",{attrs:{id:"disabled-：-boolean"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#disabled-：-boolean"}},[t._v("#")]),t._v(" disabled ： boolean")]),t._v(" "),e("p",[t._v("是否禁用mocker")]),t._v(" "),e("h4",{attrs:{id:"whitelist-：-array-string"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#whitelist-：-array-string"}},[t._v("#")]),t._v(" whiteList ： Array[string]")]),t._v(" "),e("p",[t._v("命令字白名单，默认无配置，则所有传入的命令字都会mock，不做过滤。\n若需要配置，请配置需要mock的命令字，以字符串数组的形式传入。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("mocker({\n    whiteList:[\n        'getDataRsp',\n        'getDataRsp',\n        'getDataRsp',\n    ],\n    ...\n})\n")])])]),e("h4",{attrs:{id:"times-number"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#times-number"}},[t._v("#")]),t._v(" times : number")]),t._v(" "),e("p",[t._v("若pb文件中存在返回数组的情况，可通过times设置数组项数，此配置针对全局。")]),t._v(" "),e("h4",{attrs:{id:"logger-boolean"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#logger-boolean"}},[t._v("#")]),t._v(" logger : boolean")]),t._v(" "),e("p",[t._v("是否输出日志，")]),t._v(" "),e("h4",{attrs:{id:"configuretype-object-key-datatype-value-any-function"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#configuretype-object-key-datatype-value-any-function"}},[t._v("#")]),t._v(" configureType : Object [key: dataType , value: any | function ]")]),t._v(" "),e("p",[t._v("针对数据类型进行定制，mocker内默认对int、float、string等类型有相应的mock数据配置，但是这不一定满足你的需求，例如你想返回的int数据是介于0-1000的，你期待的string长度不超过50等，可以单独配置。\n若value配置为函数形式，默认注入Mock对象，用于辅助用户生成随机数据，更多用法可翻阅mockjs文档。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('mocker({\n    configureType:{\n        "int32":mock=>{\n            return mock.Random.integer(0,100)\n        },\n        "string":"oleiwa"\n    },\n    ...\n})\n')])])]),e("p",[t._v('注：dataType为pb文件中所定义的普通类型值，包括："bool","double","float","int32",\n"uint32","int64","uint64","sint32","sint64","fixed32",\n"fixed64","sfixed32","sfixed64","string","bytes"。')]),t._v(" "),e("h4",{attrs:{id:"hook-：object-key-cmd-value-function"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#hook-：object-key-cmd-value-function"}},[t._v("#")]),t._v(" hook ：Object [] key: cmd , value : function ]")]),t._v(" "),e("p",[t._v("如果configureType仍然不能满足你的需求，mocker还暴露了hook配置，用于对每个单独的命令字做单独配置。\nkey为对应的命令字，value为相应的钩子函数，函数中将暴露两个参数，第一个参数为mocker生成的data，第二个参数为Mock对象，辅助配置。\n例如响应的请求固定code为0，表示成功，你可以配置如下：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v('hook:{\n    "StModifyGameOpenRankInfoRsp":(source,Mock)=>{\n        source.code = 0;\n    }\n},\n')])])]),e("h4",{attrs:{id:"exposevar-object"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#exposevar-object"}},[t._v("#")]),t._v(" exposeVar : Object")]),t._v(" "),e("p",[t._v("可传入一个需要暴露给mocker的对象，并结合intercept使用，截断请求。")]),t._v(" "),e("h4",{attrs:{id:"intercept-：-function"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#intercept-：-function"}},[t._v("#")]),t._v(" intercept ： function")]),t._v(" "),e("p",[t._v("后置钩子函数，可用于响应请求。配置后，将在mock data完成后调用。传入的第一参数为用户配置的exposeVar参数，第二个参数为mock后的data，可在该函数中响应请求。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("mocker({\n    exposeVar:{\n        req,\n        res,\n    },\n    intercept:({req,res},data)=>{\n        res.send(data)\n    }\n    ...\n})\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);