# Authentication service

This system for register and login and...

## install

```
npm install
```

## run project

```
npm run dev
```

```
SERVER : http://121.41.58.117:8002/api/v1/auth
LOCAL : http://localhost:8002/api/v1/auth
PORT : 8002
```

## Register

#### URL : /register

##### Method : POST

##

###

| Parameter | Type     | Description   |
| :-------- | :------- | :------------ |
| `phone`   | `string` | **Required**. |

## Complete Register

#### URL : /completeregister

##### Method : POST

##

###

| Parameter        | Type       | Description   |
| :--------------- | :--------- | :------------ |
| `phone`          | `string`   | **Required**. |
| `userName`       | `string`   | **Optional**. |
| `email`          | `string`   | **Optional**. |
| `password`       | `string`   | **Required**. |
| `pictureProfile` | `string`   | **Optional**. |
| `documents`      | `[string]` | **Optional**. |
| `firstName`      | `string`   | **Optional**. |
| `lastName`       | `string`   | **Optional**. |
| `fullName`       | `string`   | **Optional**. |

#

#

## Get informations phone

#

#### URL : /infophone/:deviceToken/:ipAddress/:osPhone/:modelPhone/:brandPhone

#

##### Method : GET

#

#

#

## Check Code

#### URL : /checksms/:code

##### Method : GET

##

###

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `:code`   | `string` | **Required**. :params |

## Again Code

#### URL : /againcode

##### Method : GET

##

###

## Login

#### URL : /login

##### Method : POST

##

###

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `phone`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

## Get Me

#### URL : /me

##### Method : GET

##

###

## Picture Profile

#### URL : /picprofile

##### Method : PUT

##

###

| Parameter        | Type     | Description   |
| :--------------- | :------- | :------------ |
| `pictureProfile` | `string` | **Required**. |

## Check phone for change password

#### URL : /checkphone/:phone

##### Method : GET

##

###

## Change Password

#### URL : /changepassword

##### Method : POST

##

###

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `password` | `string` | **Required**. |

## Change Username

#### URL : /changeusername/:username

##### Method : GET

##

###
