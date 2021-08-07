### loader装载器，webpack本身只处理js和json.对于其他类型的资源必须预先定义一个或多个loader对其进行处理。
与loader相关的配置都在module对象中，其中module.rules代表了模块的处理规则。
```
{
	test: /\.css$/, // 一个正则或者一个元素为正则的数组，只有匹配上的模块才会使用这个规则
	use: [] // 一个数组，该规则使用的loader。loader可以链式使用，执行顺序是右到左（从后往前）
	exclude: /node_modules/, //排除指定目录下的模块  exclude和include同时存在是，exclude的优先级更高
	include: './src', // 包含指定目录下的模块
}
```
### 其他属性
1. resource和issuer
```
用于更加精确地确定模块的作用范围。
resource： 指的是被加载的模块
issuer: 指的是加载者
```
```
//index.js
import './style/css'
// style.css是resource, index.js是issuer

test,exclude,include本质上属于对reqource也就是被加载的模块的配置
如果想对issuer加载者增加条件限制，则额外要写一些配置。
比如,如果只想让 /src/pages/ 目录下的js可以引用css,这条规则才会生效
rules: [
	{
		test: /\.css$/,
		use: ['style-loader','css-loader'],
		exclude: /node_modlues/,
		issuer: {
			test: /\.css$/,
			include: /src/pages/
			......
		}
	}
]

一种等价的形式
rules: [
	{
		use: ['style-loader','css-loader'],
		resource:{
			test: /\.css$/,
			exclude: /node_modlues/,
		},
		issuer: {
			test: /\.css$/,
			include: /src/pages/ //如果只想让 /src/pages/ 目录下的js可以引用css,这条规则才会生效
			......
		}
	}
]
```

2. enforce: loader的执行顺序
```
// 用来指定一个loader的种类，只接受'pre'或'post'两种字符串类型的值
loader的顺序可分为 pre,inline,normal,post四种类型
inline形式官方已经不推荐使用
pre和post则需要使用enforce来指定。

enforce: 'pre' //代表将在所有正常loader之前执行
enforce: 'post' //某个loader需要在所有loader之后执行
```

