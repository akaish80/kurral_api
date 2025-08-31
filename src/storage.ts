import { DynamoDBClient, QueryCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
export const thirukurralTableName: string = process.env['THIRUKKURAL_TABLE_NAME'] || '';
const dynamoDb = new DynamoDBClient({});

export async function createKurral(kurral: ThirukkuralEvaluation[]) {
    const start = new Date().getTime();
    try {
        if (await readAndDeleteKurral(kurral)) {
            // Batch write (put) items
            const putRequests = kurral.map(item => ({
                PutRequest: { Item: marshallKurral(item) }
            }));
            const command = new BatchWriteItemCommand({
                RequestItems: {
                    [thirukurralTableName]: putRequests
                }
            });
            await dynamoDb.send(command);
            return success('{"kurallCreation": "success"}');
        } else {
            return error(400, "Internal Server Error.");
        }
    } catch (exception) {
        console.error(`Error creating/updating promo data to dynamodb - ${exception}`);
        console.log(`event_type=\"API\", action=\"TIER_PROMO_CREATE\",status=\"Failed\", duration_millis=\"${new Date().getTime() - start}\"`);
        throw exception;
    }
}

export async function readAndDeleteKurral(thirukkuralEvaluation: ThirukkuralEvaluation[]) {
    const start = new Date().getTime();
    let allTierQry = getAllKurral(thirukkuralEvaluation[0].id || -1);
    let thrikurralList: ThirukkuralEvaluation[] = [];
    try {
        const command = new QueryCommand(allTierQry);
        let kurralResults = await dynamoDb.send(command);
        if (kurralResults && kurralResults.Items && kurralResults.Items.length) {
            kurralResults.Items.forEach((kurralItem: any) => {
                thrikurralList.push(populateThirukkuralEvaluationnModel(kurralItem));
            });
        }
        if (thrikurralList && thrikurralList.length) {
            // Batch delete items
            const deleteRequests = thrikurralList.map(item => ({
                DeleteRequest: { Key: { id: { N: String(item.id) } } }
            }));
            const batchDeleteCommand = new BatchWriteItemCommand({
                RequestItems: {
                    [thirukurralTableName]: deleteRequests
                }
            });
            await dynamoDb.send(batchDeleteCommand);
        }
        return true;
    } catch (exception) {
        console.error(`Error deleting promo data in dynamodb - ${exception}`);
        console.log(`event_type=\"API\", action=\"THIRUKURRAL_DELETE\",status=\"Failed\", duration_millis=\"${new Date().getTime() - start}\"`);
        return false;
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
         ":id": { N: String(id) },
     }
 };
}

export interface ThirukkuralEvaluation {
    id?: number;
    Line1?: string;
    Line2?: string;
    Translation?: string;
    mv?: string;
    sp?: string;
    mk?: string;
    explanation?: string;
    couplet?: string;
    transliteration1?: string;
    transliteration2?: string;
    paul_name?: string;
    paul_transliteration?: string;
    paul_translation?: string;
    iyal_name?: string;
    iyal_transliteration?: string;
    iyal_translation?: string;
    adikaram_name?: string;
    adikaram_transliteration?: string;
    adikaram_translation?: string;
}
// Helper to marshall ThirukkuralEvaluation to DynamoDB item
function marshallKurral(kurral: ThirukkuralEvaluation) {
    const item: any = {};
    if (kurral.id !== undefined) item.id = { N: String(kurral.id) };
    if (kurral.Line1 !== undefined) item.Line1 = { S: kurral.Line1 };
    if (kurral.Line2 !== undefined) item.Line2 = { S: kurral.Line2 };
    if (kurral.Translation !== undefined) item.Translation = { S: kurral.Translation };
    if (kurral.mv !== undefined) item.mv = { S: kurral.mv };
    if (kurral.sp !== undefined) item.sp = { S: kurral.sp };
    if (kurral.mk !== undefined) item.mk = { S: kurral.mk };
    if (kurral.explanation !== undefined) item.explanation = { S: kurral.explanation };
    if (kurral.couplet !== undefined) item.couplet = { S: kurral.couplet };
    if (kurral.transliteration1 !== undefined) item.transliteration1 = { S: kurral.transliteration1 };
    if (kurral.transliteration2 !== undefined) item.transliteration2 = { S: kurral.transliteration2 };
    if (kurral.paul_name !== undefined) item.paul_name = { S: kurral.paul_name };
    if (kurral.paul_transliteration !== undefined) item.paul_transliteration = { S: kurral.paul_transliteration };
    if (kurral.paul_translation !== undefined) item.paul_translation = { S: kurral.paul_translation };
    if (kurral.iyal_name !== undefined) item.iyal_name = { S: kurral.iyal_name };
    if (kurral.iyal_transliteration !== undefined) item.iyal_transliteration = { S: kurral.iyal_transliteration };
    if (kurral.iyal_translation !== undefined) item.iyal_translation = { S: kurral.iyal_translation };
    if (kurral.adikaram_name !== undefined) item.adikaram_name = { S: kurral.adikaram_name };
    if (kurral.adikaram_transliteration !== undefined) item.adikaram_transliteration = { S: kurral.adikaram_transliteration };
    if (kurral.adikaram_translation !== undefined) item.adikaram_translation = { S: kurral.adikaram_translation };
    return item;
}

export function populateThirukkuralEvaluationnModel(kurralJson: any) {
    // console.log(kurralJson.adikaram_name);
    
 let kurral: ThirukkuralEvaluation = {};
 kurral.id = kurralJson.id;
 kurral.Line1 = kurralJson.Line1;
 kurral.Line2 = kurralJson.Line2;
 kurral.Translation = kurralJson.translation;
 kurral.explanation = kurralJson.explanation;
 kurral.mv = kurralJson.mv;
 kurral.sp = kurralJson.sp;
 kurral.mk = kurralJson.mk;
 kurral.explanation = kurralJson.explanation;
 kurral.couplet = kurralJson.couplet;
 kurral.transliteration1= kurralJson.transliteration1;
 kurral.transliteration2= kurralJson.transliteration2;
 kurral.paul_name= kurralJson.paul_name;
 kurral.paul_transliteration= kurralJson.paul_transliteration;
 kurral.paul_translation= kurralJson.paul_translation;
 kurral.iyal_name= kurralJson.iyal_name;
 kurral.iyal_transliteration= kurralJson.iyal_transliteration;
 kurral.iyal_translation= kurralJson.iyal_translation;
 kurral.adikaram_name= kurralJson.adikaram_name;
 kurral.adikaram_transliteration= kurralJson.adikaram_transliteration;
 kurral.adikaram_translation= kurralJson.adikaram_translation;

 
 return kurral;
}

export async function success(payload: any) {
 return {
     statusCode: 200,
     headers: {
         'Content-Type': 'application/json'
     },
     body: payload
 };
}

export async function error(statusCode: number, errorText: string) {
 return {
     statusCode,
     body: errorText
 };
}