### UnityHub 破解

1.退出UnityHub,安装好nodejs后，用Win+R输入"cmd"执行以下命令

```
npm install -g asar
```

2.打开UnityHub安装目录如 C:\Program Files\Unity Hub\resources

3.在C:\Program Files\Unity Hub\resources打开命令行,执行以下命令解压app.asar。这里需要已管理员权限打开cmd。

```
C:\Program Files\Unity Hub\resources> asar extract .\app.asar app
```

4.修改C:\Program Files\Unity Hub\resources\app\src\services\licenseService\licenseClient.js

```js
 getLicenseInfo(callback) {
    // load license
    // get latest data from licenseCore
    //licenseInfo.activated = licenseCore.getLicenseToken().length > 0;//注释这行
	licenseInfo.activated = true;//新增这行
    licenseInfo.flow = licenseCore.getLicenseKind();
```

5.C:\Program Files\Unity Hub\resources\app\src\services\licenseService\licenseCore.js

```js
  verifyLicenseData(xml) {
    return new Promise((resolve, reject) => {
        // 新增下面3行
		this.licenseStatus = LICENSE_STATUS.kLicenseStatus_Valid;
        resolve(true);
        return;
        
      if (xml === '') {
```

