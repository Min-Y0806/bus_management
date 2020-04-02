module.exports={
    HTML:function(title,control,body){
        return`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>
    <header>
        <div class="container">
            <div id="branding">
                <h1>公交管理系统</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/workers">工作人员</a></li>
                    <li><a href="/drivers">司机</a></li>
                    <li><a href="/buses">公交车</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <section>
        <div class="container">
            <h1>${title}</h1>
            ${control}
            ${body}
        </div>
    </section>
    <footer>
        yangmin&&copy;2020
    </footer>
    <script>
    document.getElementById('search').addEventListener('change',_search)

function _search(){
const input=document.getElementById("search")
const filtered=input.value.toUpperCase();
let tdname=document.getElementsByClassName('tdname');
let i=0;
while(i<tdname.length){
    if(tdname[i].innerText.toUpperCase().indexOf(filtered)>-1){
        tdname[i].style.display=''
        tdname[i].style.background='yellow'
        
    }
    else{
        tdname[i].parentElement.style.display='none'

        
    }
    i++;
}

}

    </script>
</body>
</html>
        `
    },
    TABLE_workers:function(config){
        return`
        <table>
        <thead>
            <tr>
                <th>编号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>生日</th>
                <th>职称</th>
                <th>电话</th>
                <th colspan='2'>操作</th>
            </tr>
        </thead>
        <tbody>
            ${config}
        </tbody>
    </table>
        `
    },
    TABLE_drivers:function(config){
        return`
        <table>
        <thead>
            <tr>
                <th>编号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>生日</th>
                <th>路线</th>
                <th>电话</th>
                <th colspan='2'>操作</th>
            </tr>
        </thead>
        <tbody>
            ${config}
        </tbody>
    </table>
        `
    },
    TABLE_buses:function(config){
        return`
        <table>
        <thead>
            <tr>
                <th>编号</th>
                <th>路线</th>
                <th>车龄</th>
                <th>司机</th>
                <th colspan='2'>操作</th>
            </tr>
        </thead>
        <tbody>
            ${config}
        </tbody>
    </table>
        `
    },
    SEARCH:()=>{
    
        return `<div>
            <input type="input" id='search'onchange="_search()" placeholder="Search for names...">
        <div/>
        <style>
        
        #search{
            padding: 10px;
            margin-bottom:10px;
        }
        </style>
        
        
        `
    
    }
}