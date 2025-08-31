import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { success, ThirukkuralEvaluation, populateThirukkuralEvaluationnModel } from './storage';

export const thirukurralTableName: string = process.env['THIRUKKURAL_TABLE_NAME'] || '';
export const adikaramTableName: string = process.env['ADIKARAM_TABLE_NAME'] || '';
const dynamoDb = new DynamoDBClient({});

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
        const command = new ScanCommand({ TableName: adikaramTableName });
        let kurralResults = await dynamoDb.send(command);
        let kurralItem = kurralResults && kurralResults.Items;
        let sortedItems;
        if (kurralItem) {
            sortedItems = getSortedList(kurralItem);
        }
        if (sortedItems && sortedItems.length > 0) {
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
    let all: any = [];
    let ExclusiveStartKey = undefined;
    while (true) {
        const command: ScanCommand = new ScanCommand({ ...params, ExclusiveStartKey });
        const data = await dynamoDb.send(command);
        all = all.concat(data.Items || []);
        if (data.LastEvaluatedKey) {
            ExclusiveStartKey = data.LastEvaluatedKey;
        } else {
            break;
        }
    }
    return all;
};



export async function getKurralListByAdikarm(beginIndex: Number, endIndex: Number) {
    let getKurralQueryForScan = getKurral(beginIndex, endIndex);

    let kurralItemList: any[] = [];
    try {
        const records = await scanAll(getKurralQueryForScan);
        kurralItemList = getSortedList(records);
    } catch (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    }
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
        const command = new QueryCommand(getKurralQuery);
        let kurralResults = await dynamoDb.send(command);
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
         ":id": { N: id.toString() },
     }
 };
}

function getKurral(beginIndex: Number, endIndex: Number) {
    return {
        TableName: thirukurralTableName,
        FilterExpression:'id BETWEEN :beginIndex AND :endIndex',
        ExpressionAttributeValues:{ 
            ":beginIndex" : beginIndex,
            ":endIndex" : endIndex,
         },
        Limit: 500,
    };
   }
