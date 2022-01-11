import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
window.addEventListener('load', () => {
    FYSCloud.API.configure({
        url: "https://api.fys.cloud",
        apiKey: "fys_is108_3.xPgSL3VLOKzdmUMe",
        database: "fys_is108_3_dev",
        environment: "dev"
    });

    document.querySelector(".zoeken").addEventListener("click", event => {
        FYSCloud.API.queryDatabase(
            "SELECT email FROM users"
        ).then(function(data) {
            console.log(data)
            let invoer = document.getElementById("email").value;
            console.log(data.length)
            for (let i = 0; i <data.length ; i++) {
                let {email} = data[i];
                if(invoer === email){
                    console.log("We hebben je account gevonden.")
                }
                console.log(email)
            }

        }).catch(function(reason) {
            console.log(reason);
        });
    })
})