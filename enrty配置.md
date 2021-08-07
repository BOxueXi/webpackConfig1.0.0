### entry的配置可以多种形式：字符串，数组，对象
1. 字符串类型入口
```
 // 直接传入文件路径
module.exports = {
	entry: './src/index.js'
}
```

2. 数组类型入口
```
// 传入一个数组的作用是将多个资源预先合并，在打包时webpack会将数组中的最后一个元素作为实际的入口路径
module.exports = {
	entry: ['babel-polyfill','./src/index.js'],
}
上面配置等同于
// webpack.config.js
module.exports = {
	entry: './src/index.js',
}
//index.js
import 'babel-polyfill'

```

3. 对象类型入口
```
// 想要定义多入口，则必须使用对象的形式。对象的属性名(key)是chunk name,属性值(value)是入口路径。如：
module.exports = {
	entry: {
		index: './src/index.js',
		lib: './src/lib.js'
	}
}
对象的属性值也可以为字符串或数组
module.exports = {
	entry: {
		index: ['babel-polyfill','./src/index.js'],
		lib: './src/lib.js'
	}
}

在使用字符串或数组定义单入口是，不能更改chunk name，只能为默认的‘main’; 在使用对象来定义多入口是，则必须为每一个入口定义一个chunk name。
```

4. 函数类型入口
```
// 用函数定义入口是，只要返回 字符串，数组，对象中的其中一个配置形式即可，如： 

// 返回字符串类型的入口
module.exports = {
	entry: () => './src/lib.js'
}
// 返回对象类型的入口
module.exports = {
	entry: () => ({
		index: ['babel-polyfill','./src/index.js'],
		lib: './src/lib.js'
	})
}

传一个函数的优势在于 可以在函数体里添加一些动态的逻辑来获取工程的入口。另外也支持返回一个Promise对象来进行异步操作
module.exports = {
	entry: () => new Promise((resolve,reject)=>{
		// 模拟异步操作
		setTimeout(()=>{
			resolve('./src/index.js');
		},1000)
	})
}
```