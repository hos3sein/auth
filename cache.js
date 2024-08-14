const caching = require('node-cache')


const cacheHeat = new caching();


const setdata = (key , value)=>{
    // console.log('chack')
    cacheHeat.mset([
        {
            key : key,
            val : value
        }
    ])
    // console.log(cacheHeat.get('hotest'))
}


const getdata = (key)=>{
    // console.log('chech')
    try{
        // console.log(cacheHeat.get(key))
        return(cacheHeat.get(key))
    }catch{
        throw new Error('data not found')
    }
}


const deleter = ()=>{
    const K = cacheHeat.keys()
    cacheHeat.del(K)
}


module.exports = {setdata , getdata , deleter}


