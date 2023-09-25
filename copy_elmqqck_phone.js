const axios = require('axios');
const homeURL = "http://192.168.6.99:5701" //来源青龙地址
const localURL = "http://127.0.0.1:5700"   //你要同步到的青龙地址
let homeToken = ""
let localToken = ""

main()
async function main() {
    this.homeToken = await getLogin(homeURL, '-4Bfc7zshQyB', 'A1pa6p3SHuOP-ktV2gaq-m9A')  //来源青龙token
    this.localToken = await getLogin(localURL, '_L0jJeoqQCgb', 'NmP-0WRdDPmAaY1xQPnF1wu9') //你要同步到的青龙地址token

    const homeck = await qlselect(homeURL, 'elmqqck', this.homeToken)
    const localck = await qlselect(localURL, 'elmqqck', this.localToken)
    let oldlocalid = []
    if (localck.length) {
        //删除本地的
        for (let i = 0; i < localck.length; i++) {
            oldlocalid.push(localck[i].id||localck[i]._id)
        }
        await qldel(localURL, oldlocalid, this.localToken)
       for (let i = 0; i < homeck.length; i++) {
          await  qlinsert(localURL,homeck[i].name,homeck[i].value,homeck[i].remarks,this.localToken)
        }
    } else {
        //复制家里到本地
          for (let i = 0; i < homeck.length; i++) {
          await  qlinsert(localURL,homeck[i].name,homeck[i].value,homeck[i].remarks,this.localToken)
        }
     
    }




}

//获取青龙面板token
async function getLogin(url, id, secret) {
    const { data } = await axios({
        url: url + '/open/auth/token',
        params: {
            client_id: id,
            client_secret: secret
        }
    })
    if (data.code == 200) {
        return data.data.token_type + ' ' + data.data.token
    } else {
        console.log(data)
    }
}
//获取青龙里指点变量
async function qlselect(url, qq, qltokens) {
    const { data } = await axios({
        url: url + "/open/envs",
        params: {
            searchValue: qq
        },
        headers: {
            "Authorization": qltokens,
        }
    });
    if (data.code == 200) {
        return data.data
    } else {
        console.log(data)
    }

}

//删除青龙里的变量
async function qldel(url, id, qltokens) {
    const { data } = await axios({
        url: `${url}/open/envs`,
        method: 'DELETE',
        data: id,
        headers: {
            "Authorization": qltokens,
        }
    })
    if (data.code == 200) {
        return data.data
    } else {
        console.log(data)
    }
}


//青龙面板添加方法
async function qlinsert(url, name, ck, remarks, qltokens) {
    const { data } = await axios({
        url: `${url}/open/envs`,
        method: 'POST', // post大小写都可以
        data: [{
            "name": name,
            "value": ck,
            "remarks": remarks
        }],
        headers: {
            "Authorization": qltokens
        }
    });
    if (data.code == 200) {
        console.log(`已同步${remarks}`)
        return data.data
    } else {
        console.log(data)
    }
}
