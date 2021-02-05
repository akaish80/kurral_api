import { DynamoDB } from "aws-sdk";
import { success, ThirukkuralEvaluation, populateThirukkuralEvaluationnModel } from './storage';

export const thirukurralTableName: string = process.env['THIRUKKURAL_TABLE_NAME'] || '';
export const adikaramTableName: string = process.env['ADIKARAM_TABLE_NAME'] || '';
const dynamoDb = new DynamoDB.DocumentClient();

export async function getKurralJSON(kurralId: number) {
  let kurral: ThirukkuralEvaluation = await getKurralByID(kurralId);
  if (kurral) {
   return success(JSON.stringify(kurral));
  }
  console.error('No Kurral By ID Data found');
  return success('{}');
}

export async function getAllAdikaramJSON() {
    // let kurral: ThirukkuralEvaluation = await getKurralByID();
    console.error('Arun is here');
    
    let kurral: ThirukkuralEvaluation;
    let kurralList: String[] = new Array();
    
    try {
        let kurralResults = await dynamoDb.scan({
            TableName: adikaramTableName}).promise();
        let kurralItem = kurralResults && kurralResults.Items;
        if (kurralItem) {
            // kurral = populateThirukkuralEvaluationnModel(kurralItem);
            console.log(` Kurral ${ kurralResults.Items.length}`);

            const { Items } = kurralResults;
            const sortedItems = Items.sort((a, b) => {
                // console.log('a ' + a + ' b ' + b);
                // if (a === "K" || b === "N") {
                //     return -1;
                // }
                // if (a === "N" || b === "K") {
                //     return 1;
                // }
                return +a.id - +b.id;
            });
            
            console.log(sortedItems);

            
            for (let index = 0; index < sortedItems.length; index++) {
                const element = sortedItems[index];
                kurralList.push(element.adikaram)
                // const kuralData =   populateThirukkuralEvaluationnModel(element);
                // // if (kurralList.find)
                // if (kurralList.length > 0){
                //     const kurraalObj = {adikaram: ""};
                //     console.log(` kuralData.adikaram_name -> ${ kuralData.adikaram_name } `);
                //     const found = kurralList.findIndex(element => element === kuralData.adikaram_name);

                //     if (found === -1){
                //         // kurraalObj.adikaram = kuralData.adikaram_name.toString();
                //         kurralList.push(kuralData.adikaram_name.toString())
                //         console.log(` kurralList -> ${ kurralList.length } `);
                //     }
                // } else {
                //     kurralList.push(kuralData.adikaram_name)
                //     console.log(` kurralList -> ${ kurralList.length } `);
                // }
            }
            console.log(kurralList);
            
        }
        if (kurralList.length > 0) {
         return success(JSON.stringify(kurralList));
        }
        console.error('No Kurral By ID Data found');
        return success('{}');
    } catch (exception) {
        console.error(`Error fetching kurral adikaram from dynamodb - ${exception}`);
        
        return success('{}');
    }
}

async function getKurralByID(id: number) {
 let kurral: ThirukkuralEvaluation;
 let getKurralQuery = getAllKurral(id);
 try {
  let kurralResults = await dynamoDb.query(getKurralQuery).promise();
  let kurralItem = kurralResults && kurralResults.Items && kurralResults.Items[0];
  if (kurralItem) {
   kurral = populateThirukkuralEvaluationnModel(kurralItem);
  }
  return kurral;
 } catch (exception) {
  console.error(`Error fetching kurral from dynamodb - ${exception}`);
  return kurral;
 }
}

function getAllKurral(id: number) {
 return {
     TableName: thirukurralTableName,
     KeyConditionExpression: "#id = :id",
     ExpressionAttributeNames: {
         "#id": "id"
     },
     ExpressionAttributeValues: {
         ":id": id,
     }
 };
}

function getKurral() {
    return {
        TableName: thirukurralTableName,
        KeyConditionExpression: "#id > :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": 0,
        }
    };
   }
class KurralInfo {
 id: string;
}