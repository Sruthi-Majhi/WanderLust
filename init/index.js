const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");
let mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
async function main()
{
    await mongoose.connect(mongoUrl);
}

main().then(()=>
{
    console.log("Connection established");
})
.catch((err)=>
{
    console.log(err);
});

const initDB= async ()=>
    {
        await listing.deleteMany({});
        await listing.insertMany(initData.data);
        console.log("sucessfully saved the data");
    }
    initDB();

    