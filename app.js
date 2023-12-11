 const express = require("express");
 const bodyParser = require("body-parser");
 const session = require("express-session");
 const app = express();

 const mongoose = require("mongoose");
 
 app.set("view engine", "ejs")
 
 mongoose.connect("mongodb+srv://adityasinghofficial06:todolist@cluster0.bidkojv.mongodb.net/User_detaildb");

 const UserSchema  = new mongoose.Schema({
     Username:String,
     password:String,
     Email:String,
     task:Array
    });
    
app.use(bodyParser.urlencoded({extended: true}));
    
app.use(
    session({
    secret: "to-do-list",
    cookie: { secure: false },
    saveUninitialized:false,
    resave:false,
    })
);

 const User =  mongoose.model("User_detail", UserSchema);

 app.use(express.static("public"));

app.get("/", (req, res)=>
{
    res.render("home_page")   
});

app.get("/list", (req, res) => {
    res.render("list");
});

app.get("/home_page", (req, res)=>
{
    res.render("home_page");
});

app.get("/sign-up_page", (req, res)=>
{
    res.render("sign-up_page");
});

app.get("/error", (req, res)=>
{
    res.render("error_page");
});

app.get("/contact", (req, res)=>
{
    res.render("contact");
})



app.post("/create_account", async(req, res)=>
{
    const user = User({
        Username: req.body.Username,
        Email: req.body.Email,
        password: req.body.password
    });

    await user.save();
    
    req.session.email = req.body.Email; 

    res.redirect("/list");

});

app.post("/sign_up", async(req, res)=>
{
    const email = req.body.email;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    const foundUser = await User.findOne({ Email: email});

    if(foundUser)
    {
        if(foundUser.password === password)
        {
            req.session.email = foundUser.Email;
            res.redirect("/list");
        }  
        else
        {
            console.log("wrong password");
            res.render("error_page");
        }
    }
    else
    {
        console.log("User does not exist");
    }
});


app.post("/create_task", async(req, res)=>
{
    const task = req.body.targets;
    req.session.task = task;

    await User.findOneAndUpdate(
        { Email: req.session.email }, 
        { $push: { task: task } 
    });
    
    const account =  await User.findOne({ Email: req.session.email });
    
    const tasks = account.task;

    res.render("list", {
        tasks: tasks
    }); 
})


app.get("/get_task", async(req, res)=>
{
    const account =  await User.findOne({ Email: req.session.email });
    
    const tasks = account.task;

    res.render("list", {
        tasks: tasks
    }); 
});


app.post("/delete_task", async(req, res)=>
{
    
    const accounts = await User.findOneAndUpdate({Email:req.session.email}, {$pull:{task:req.body.task_text}});

    
        const account =  await User.findOne({ Email: req.session.email });
        
        const tasks = account.task;
    
        res.render("list", {
            tasks: tasks
        }); 

})

app.post("/complete_task", async(req, res)=>
{
    
    const accounts = await User.findOneAndUpdate({Email:req.session.email}, {$pull:{task:req.body.task_text}});

    const account =  await User.findOne({ Email: req.session.email });
        
    const tasks = account.task;

    res.render("list", {
        tasks: tasks
    }); 
})

app.listen(2700, ()=>
{
    console.log("Server is up and running at port 2700");
});