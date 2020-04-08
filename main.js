const express = require("express"); //使用express模块
const app = express();
const port = process.env.PORT || 3000; //设置端口号
const template = require("./templates/template");
const path = require("path");

const mydb = require('./templates/database')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));

const mysql = require("mysql");
const connection = mysql.createConnection(
    mydb
)
connection.connect();


app.use('/', express.static(__dirname + '/public'));
app.use('/workers', express.static(__dirname + '/public'));
app.use('/drivers', express.static(__dirname + '/public'));
app.use('/buses', express.static(__dirname + '/public'));


//主画面
app.get('/', (req, res) => { // 以get方式进入到'/'
    const title = 'welcome';
    const body = `<p>通过本网页可以查询公交公司服务端工作人员信息和公交公司司机信息</p>
    <a href='/workers'>工作人员信息表</a><br/>
    <a href='/drivers'>司机信息表</a></br>
    <a href='/buses'>公交车信息表</a>
    `;
    const control = '';
    const html = template.HTML(title, body, control);
    res.send(html)

})

//工作人员信息
app.get('/workers', (req, res) => {
    connection.query(`SELECT * FROM workers`, (err, workers) => {
        const title = '服务端工作人员信息';
        let config = '<tr>';
        workers.map(driver => {
            config += `
            <td>${driver.id}</td>
            <td class='tdname'>${driver.name}</td>
            <td>${driver.gender}</td>
            <td>${driver.birthday}</td>
            <td>${driver.job}</td>
            <td>${driver.tel}</td>
            <td><a href='/edit?workers=${driver.id}'>编辑</a></td>
            <td><a href='/delete?workers=${driver.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const body = template.TABLE_workers(config);
        const control = ` <div><input name="search" id="search" placeholder='输入姓名查找'><button id="search_btn">查找</button>
        </div><a href='/create'>新建</a>`
        const html = template.HTML(title, control, body)
        res.send(html)
    })
})

//新建工作人员
app.get('/create', (req, res) => {
    connection.query(`SELECT * FROM workers`, (err, workers) => {
        const title = '添加服务端工作人员';
        let config = '<tr>';
        workers.map(worker => {
            config += `
            <td>${worker.id}</td>
            <td class='tdname'>${worker.name}</td>
            <td>${worker.gender}</td>
            <td>${worker.birthday}</td>
            <td>${worker.job}</td>
            <td>${worker.tel}</td>
            <td><a href='/edit?workers=${worker.id}'>编辑</a></td>
            <td><a href='/delete?workers=${worker.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const control = `
        <form action="/create" method="POST">
        <input type="text" placeholder="姓名" name="name">
        <input type="text" placeholder="性别" name="gender">
        <input type="text" placeholder="生日" name="birthday">
        <input type="text" placeholder="职称" name="job">
        <input type="text" placeholder="电话" name="tel"><br/>
        <button type='submit'>创建</button>
        </form>
        `
        const body = template.TABLE_workers(config);
        const html = template.HTML(title, control, body)
        res.send(html)
    })
})

app.post('/create', (req, res) => {
    connection.query(`INSERT INTO workers (name,gender,birthday,job,tel) VALUES (?,?,?,?,?)`,
        [req.body.name,
            req.body.gender,
            req.body.birthday,
            req.body.job,
            req.body.tel
        ], (err, rows) => {
            res.redirect('/workers')
        })
})

//编辑工作人员信息
app.get("/edit", (req, res) => {
    connection.query(`SELECT * FROM workers`, (err, workers) => {
        connection.query(`SELECT * FROM workers WHERE id=?`, [req.query.workers], (err2, edit_worker) => {
            const title = '编辑服务端工作人员信息';
            let config = '<tr>';
            workers.map(worker => {
                config += `
                <td>${worker.id}</td>
                <td class='tdname'>${worker.name}</td>
                <td>${worker.gender}</td>
                <td>${worker.birthday}</td>
                <td>${worker.job}</td>
                <td>${worker.tel}</td>
                <td><a href='/edit?workers=${worker.id}'>编辑</a></td>
                <td><a href='/delete?workers=${worker.id}'>删除</a></td>
                `
                config += '</tr>'
                return config;
            })
            const body = template.TABLE_workers(config);
            const control = `<a href='/create'>新建</a>
            <form action="/edit" method="POST">
            <input type="hidden" name="id" value=${req.query.workers}>
            <input type="text" placeholder="姓名" name="name" value=${edit_worker[0].name}>
            <input type="text" placeholder="性别" name="gender" value=${edit_worker[0].gender}>
            <input type="text" placeholder="生日" name="birthday" value=${edit_worker[0].birthday}>
            <input type="text" placeholder="职称" name="job" value=${edit_worker[0].job}>
            <input type="text" placeholder="电话" name="tel" value=${edit_worker[0].tel}>
            <button type="submit">修改</button>
            `
            const html = template.HTML(title, control, body)
            res.send(html)
        })

    })
})


app.post('/edit', (req, res) => {
    connection.query(`UPDATE workers SET name=?,gender=?,birthday=?,job=?,tel=? WHERE id=?`,
        [req.body.name,
            req.body.gender,
            req.body.birthday,
            req.body.job,
            req.body.tel, req.body.id
        ], (err, rows) => {
            res.redirect('/workers')
        })
})

//删除工作人员信息
app.get('/delete', (req, res) => {
    let id = req.query.workers;
    connection.query(`DELETE FROM workers WHERE id=?`, [id], (err, worker) => {
        res.redirect('/workers')
    })
})


// 公交车司机信息
app.get('/drivers', (req, res) => {
    connection.query(`SELECT * FROM drivers`, (err, drivers) => {
        const title = '司机信息';
        let config = '<tr>';
        drivers.map(driver => {
            config += `
            <td>${driver.id}</td>
            <td class='tdname'>${driver.name}</td>
            <td>${driver.gender}</td>
            <td>${driver.birthday}</td>
            <td>${driver.line}</td>
            <td>${driver.tel}</td>
            <td><a href='/edit_dr?drivers=${driver.id}'>编辑</a></td>
            <td><a href='/delete_dr?drivers=${driver.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const body = template.TABLE_drivers(config);
        const control = `<input name="search" id="search" placeholder='输入姓名查找'><button id="search_btn">查找</button>
        </br><a href='/create_drivers'>新建</a>`
        const html = template.HTML(title, control, body)
        res.send(html);
    })
})

app.get('/create_drivers', (req, res) => {
    connection.query(`SELECT * FROM drivers`, (err, drivers) => {
        const title = '添加司机';
        let config = '<tr>';
        drivers.map(driver => {
            config += `
            <td>${driver.id}</td>
            <td class='tdname'>${driver.name}</td>
            <td>${driver.gender}</td>
            <td>${driver.birthday}</td>
            <td>${driver.line}</td>
            <td>${driver.tel}</td>
            <td><a href='/edit_dr?drivers=${driver.id}'>编辑</a></td>
            <td><a href='/delete_dr?drivers=${driver.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const control = `
        <form action="/create_drivers" method="POST">
        <input type="text" placeholder="姓名" name="name">
        <input type="text" placeholder="性别" name="gender">
        <input type="text" placeholder="生日" name="birthday">
        <input type="text" placeholder="路线" name="line">
        <input type="text" placeholder="电话" name="tel"><br/>
        <button type='submit'>创建</button>
        </form>
        `
        const body = template.TABLE_drivers(config);
        const html = template.HTML(title, control, body)
        res.send(html)
    })
})

app.post('/create_drivers', (req, res) => {
    connection.query(`INSERT INTO drivers (name,gender,birthday,line,tel) VALUES (?,?,?,?,?)`,
        [req.body.name,
            req.body.gender,
            req.body.birthday,
            req.body.line,
            req.body.tel
        ], (err, rows) => {
            res.redirect('/drivers')
        })
})

app.get("/edit_dr", (req, res) => {
    connection.query(`SELECT * FROM drivers`, (err, drivers) => {
        connection.query(`SELECT * FROM drivers WHERE id=?`, [req.query.drivers], (err2, edit_driver) => {
            const title = '编辑服务端工作人员信息';
            let config = '<tr>';
            drivers.map(driver => {
                config += `
                <td>${driver.id}</td>
                <td class='tdname'>${driver.name}</td>
                <td>${driver.gender}</td>
                <td>${driver.birthday}</td>
                <td>${driver.line}</td>
                <td>${driver.tel}</td>
                <td><a href='/edit_dr?drivers=${driver.id}'>编辑</a></td>
                <td><a href='/delete_dr?drivers=${driver.id}'>删除</a></td>
                `
                config += '</tr>'
                return config;
            })
            const body = template.TABLE_drivers(config);
            const control = `<a href='/create_drivers'>新建</a>
            <form action="/edit_dr" method="POST">
            <input type="hidden" name="id" value=${req.query.drivers}>
            <input type="text" placeholder="姓名" name="name" value=${edit_driver[0].name}>
            <input type="text" placeholder="性别" name="gender" value=${edit_driver[0].gender}>
            <input type="text" placeholder="生日" name="birthday" value=${edit_driver[0].birthday}>
            <input type="text" placeholder="路线" name="line" value=${edit_driver[0].line}>
            <input type="text" placeholder="电话" name="tel" value=${edit_driver[0].tel}>
            <button type="submit">修改</button>
            `
            const html = template.HTML(title, control, body)
            res.send(html)
        })

    })
})


app.post('/edit_dr', (req, res) => {
    connection.query(`UPDATE drivers SET name=?,gender=?,birthday=?,line=?,tel=? WHERE id=?`,
        [req.body.name,
            req.body.gender,
            req.body.birthday,
            req.body.line,
            req.body.tel, req.body.id
        ], (err, rows) => {
            res.redirect('/drivers')
            console.log(req.body)
        })
})

app.get('/delete_dr', (req, res) => {
    let id = req.query.drivers;
    connection.query(`DELETE FROM drivers WHERE id=?`, [id], (err, driver) => {
        res.redirect('/drivers')
    })
})

// 公交车信息
app.get('/buses', (req, res) => {
    connection.query(`SELECT * FROM buses`, (err, buses) => {
        const title = '公交车信息';
        let config = '<tr>';
        buses.map(bus => {
            config += `
            <td>${bus.id}</td>
            <td class='tdname'>${bus.line}</td>
            <td>${bus.age}</td>
            <td>${bus.driver}</td>
            <td><a href='/edit_bus?buses=${bus.id}'>编辑</a></td>
            <td><a href='/delete_bus?buses=${bus.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const body = template.TABLE_buses(config);
        const control = `<input name="search" id="search" placeholder='输入路线查找'><button id="search_btn">查找</button>
        </br><a href='/create_buses'>新建 </a><a href='/order_buses'>公交排序</a>`
        const html = template.HTML(title, control, body)
        res.send(html);
    })
})

app.get('/create_buses', (req, res) => {
    connection.query(`SELECT * FROM buses`, (err, buses) => {
        const title = '添加公交车';
        let config = '<tr>';
        buses.map(bus => {
            config += `
            <td>${bus.id}</td>
            <td>${bus.line}</td>
            <td>${bus.age}</td>
            <td>${bus.driver}</td>
            <td><a href='/edit_bus?buses=${bus.id}'>编辑</a></td>
            <td><a href='/delete_bus?buses=${bus.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const control = `
        <form action="/create_buses" method="POST">
        <input type="text" placeholder="路线" name="line">
        <input type="text" placeholder="车龄" name="age">
        <input type="text" placeholder="司机" name="driver"><br/>
        <button type='submit'>创建</button>
        </form>
        `
        const body = template.TABLE_buses(config);
        const html = template.HTML(title, control, body)
        res.send(html)
    })
})

app.post('/create_buses', (req, res) => {
    connection.query(`INSERT INTO buses (line,age,driver) VALUES (?,?,?)`,
        [req.body.line,
            req.body.age,
            req.body.driver
        ], (err, rows) => {
            res.redirect('/buses')
        })
})

app.get("/edit_bus", (req, res) => {
    connection.query(`SELECT * FROM buses`, (err, buses) => {
        connection.query(`SELECT * FROM buses WHERE id=?`, [req.query.buses], (err2, edit_bus) => {
            const title = '编辑公交车信息';
            let config = '<tr>';
            buses.map(bus => {
                config += `
                <td>${bus.id}</td>
            <td>${bus.line}</td>
            <td>${bus.age}</td>
            <td>${bus.driver}</td>
            <td><a href='/edit_bus?buses=${bus.id}'>编辑</a></td>
            <td><a href='/delete_bus?buses=${bus.id}'>删除</a></td>
                `
                config += '</tr>'
                return config;
            })
            const body = template.TABLE_buses(config);
            const control = `<a href='/create_buses'>新建 </a><a href='/order_buses'>公交排序</a>
            <form action="/edit_bus" method="POST">
            <input type="hidden" name="id" value=${req.query.buses}>
            <input type="text" placeholder="路线" name="line" value=${edit_bus[0].line}>
            <input type="text" placeholder="车龄" name="age" value=${edit_bus[0].age}>
            <input type="text" placeholder="司机" name="driver" value=${edit_bus[0].driver}></br>
            <button type="submit">修改</button>
            </form>
            `
            const html = template.HTML(title, control, body)
            res.send(html)
        })

    })
})


app.post('/edit_bus', (req, res) => {
    connection.query(`UPDATE buses SET line=?,age=?,driver=? WHERE id=?`,
        [req.body.line,
            req.body.age,
            req.body.driver, req.body.id
        ], (err, rows) => {
            res.redirect('/buses')
        })
})

app.get('/delete_bus', (req, res) => {
    let id = req.query.buses;
    connection.query(`DELETE FROM buses WHERE id=?`, [id], (err, bus) => {
        res.redirect('/buses')
    })
})

app.get('/order_buses', (req, res) => {
    connection.query(`SELECT * FROM buses ORDER BY line`, (err, buses) => {
        const title = '公交车信息';
        let config = '<tr>';
        buses.map(bus => {
            config += `
            <td>${bus.id}</td>
            <td class='tdname'>${bus.line}</td>
            <td>${bus.age}</td>
            <td>${bus.driver}</td>
            <td><a href='/edit_bus?buses=${bus.id}'>编辑</a></td>
            <td><a href='/delete_bus?buses=${bus.id}'>删除</a></td>
            `
            config += '</tr>'
            return config;
        })
        const body = template.TABLE_buses(config);
        const control = `<input name="search" id="search" placeholder='输入路线查找'><button id="search_btn">查找</button>
        </br><a href='/create_buses'>新建 </a><a href='/order_buses'>公交排序</a>`
        const html = template.HTML(title, control, body)
        res.send(html);
    })
})

//连接端口
app.listen(port, () => {
    console.log(`Server is running on port${port}`)
});