### js兼容
/*
js兼容
第一种. babel-loader @babel/core @babel/preset-env : 只能转换基本语法，如：promise不能转换
第二种. 继续下载 @babel/polyfill: 全部js兼容,但是体积太大（使用时直接在js文件里面引入：import '@babel/polyfill'）
第三种. 继续下载core-js  按需转换

当使用第三种时不能使用第二种
*/
```
使用第三种：在根目录创建 .babelrc文件配置如下
{
  "presets": [
	  [
		"@babel/preset-env",
		{
		"useBuiltIns": "usage",//按需加载
		"corejs":"3.16.0" // core-js的版本
		}
	  ]
	]
}
```

 ### 压缩js文件
(https://webpack.docschina.org/plugins/terser-webpack-plugin/)
 uglifyjs-webpack-plugin: 不支持es6语法
 terser-webpack-plugin: webpack5以上版本，自带了这个插件，如果使用webpack4,则必须安装
 ```
 optimization: {
     minimizer: [
       new TerserPlugin({
         ...
       }),
     ],
   },
 ```
 
 ### js代码分割 code split
 /*
 ### 1.多入口文件
 ### 2.单入口
  ```
  1. 对node_module引用单独打包成一个文件
  2. import()方法引入文件，会单独打包成一个文件
  3. require.ensure() 会单独打包成一个文件
  ```
 单页应用过程中的代码分割:是通过webpack的写法和内置函数实现的,因为是单页应用，所以只要引用入口文件即可
 目前webpack针对此项功能提供 2 种函数：
 1.import(): 引入之后会自动执行相关js代码
 2.require.ensure(): 引入不会自动执行js代码,需要手动执行相关js代码
 */
```
optimization: {
	splitChunks: {
		cacheGroups: { //缓存组
			common: { //公共的模块
				chunks: 'initial',
				minSize: 0,
				minChunks:2
			},
			//抽离第三方模块
			vendor: {
				priority: 1, //优先级，值越大优先级越高 
				test: /node_modules/,
				chunks: 'initial',
				minSize: 0,
				minChunks: 2
			}
		}
	}
}
```

### SplitChunks的默认配置
```
chunks: 'async',//splitChunks的工作模式（选择哪些 chunk 进行优化），有三个可选值: async(默认的值),initial,all ;
async: 只提取异步的chunk；
initial: 只对入口chunk生效；
all: 两种模式同时开启；


name: 配置项name，为true意味着可以根据cacheGroups和作用范围自动为新生成的chunk名，并以automaticNameDelimiter分割。如defaultVendors~a~b~c.js 意思是cacheGroups为defaultVendors，并且该chunk是由啊，a,b,c三个入口chunk所产生的。

splitChunks: {
	chunks: 'async',//splitChunks的工作模式，有三个可选值: async(默认的值),initial,all ;
	minSize: 20000, //生成 chunk 的最小体积（以 bytes 为单位）
	minRemainingSize: 0, //通过确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
	minChunks: 1,//拆分前必须共享模块的最小 chunks 数。
	maxAsyncRequests: 30,//按需加载时的最大并行请求数。
	maxInitialRequests: 30,//入口点的最大并行请求数。
	enforceSizeThreshold: 50000,//强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
	name: true,//拆分 chunk 的名称
    cacheGroups: { //缓存组可以继承和/或覆盖来自 splitChunks.* 的任何选项。但是 test、priority 和 reuseExistingChunk 只能在缓存组级别上进行配置。
		defaultVendors: {
			test: /[\\/]node_modules[\\/]/,
			priority: -10, //优先级 值越大，优先级越高
			reuseExistingChunk: true,//如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。（如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块）
		},
		default: {
			minChunks: 2,//
			priority: -20,//优先级 值越大，优先级越高
			reuseExistingChunk: true,//如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
		},
	}
}
```
```
//将当前模块的记录其他模块的hash单独打包为一个文件 
//解决： 修改a文件导致b文件的contenthash变化
optimization:{
	runtimeChunk: {
		name: entrypoint => `runtime-${entrypoint.name}`
	}
}

```
