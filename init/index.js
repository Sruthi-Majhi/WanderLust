import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

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
        initData.data = initData.data.map((obj) => ({...obj, owner:'6728f0e1e643d4f7e7722b71'}));
        await listing.insertMany(initData.data);
        console.log("sucessfully saved the data");
    }
    initDB();

    