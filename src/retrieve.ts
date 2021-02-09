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

const getSortedList = (Items: any[]) => {
    return Items.sort((a, b) => {
        return +a.id - +b.id;
    });
}

export async function getAllAdikaramJSON() {
    
    try {
        let kurralResults = await dynamoDb.scan({
            TableName: adikaramTableName}).promise();
        let kurralItem = kurralResults && kurralResults.Items;
        let sortedItems;
        if (kurralItem) {
            const { Items } = kurralResults;
            sortedItems = getSortedList(Items);
        }
        if (sortedItems.length > 0) {
         return success(JSON.stringify(sortedItems));
        }
        console.error('No Kurral By ID Data found');
        return success('{}');
    } catch (exception) {
        console.error(`Error fetching kurral adikaram from dynamodb - ${exception}`);
        
        return success('{}');
    }
}

const scanAll = async (params: any) => {
    let all:any = [];
    while (true) {
        let data:any = await new Promise((resolve, reject) => {
            dynamoDb.scan(params, function (err:any, data:any) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
        all = all.concat(data.Items);
        if (data.LastEvaluatedKey)
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        else
            break;
    }
    return all;
};



export async function getKurralListByAdikarm(adikaram_name:String) {
    let getKurralQueryForScan = getKurral(adikaram_name);

    let kurralItemList = await scanAll(getKurralQueryForScan)
    .catch((err) => {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        // return success('{}');
    })
    .then((records) => {
        return getSortedList(records);
    });
    
    if (kurralItemList.length > 0) {
        return success(JSON.stringify(kurralItemList));
    } else {
        console.error('No Kurral By ID Data found');
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

function getKurral(adikaram: String) {
    return {
        TableName: thirukurralTableName,
        FilterExpression:'adikaram_name = :adikaram_name',
        ExpressionAttributeValues:{ ":adikaram_name" : adikaram },
        Limit: 500,
    };
   }
