import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

/**
 * Get Gitlab variables :-)
 * @type {string}
 */
// var url='https://gitlab.fdmci.hva.nl/api/v4/projects/17997/variables';
// let getGitLabVars = async ()=>{
//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'PRIVATE-TOKEN': 'MWmhq3SYSR3xh5F-Axux',
//             'Content-Type': 'application/json',
//         },
//     });
//     const Json = await response.json();
//     FYSCloud.API.configure({
//         url: "https://api.fys.cloud",
//         apiKey: Json[8],
//         database: Json[9],
//         environment: "mockup"
//     });
// };

// getGitLabVars();
    FYSCloud.API.configure({
        url: "https://api.fys.cloud",
        apiKey: "fys_is108_3.xPgSL3VLOKzdmUMe",
        database: "fys_is108_3_dev",
        environment: "mockup"
    });

