let mypromise = new Promise((resolve, reject)=>{
    resolve('hello');
});

let f = async ()=>{
    console.log('Before promise');
    console.log('Loop starts...');
    for(let i=0; i<1000000; i++);
    console.log('loop ends...');
    await mypromise.then((message)=>{
        console.log("Promise message: "+message);
    });
    console.log('After promise');
};

f();