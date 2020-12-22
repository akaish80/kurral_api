import { DynamoDB } from "aws-sdk";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import { attribute, hashKey, table} from "@aws/dynamodb-data-mapper-annotations";
export const thirukurralTableName: string = process.env['THIRUKKURAL_TABLE_NAME'] || '';
const mapper = new DataMapper({ client: new DynamoDB() });
const dynamoDb = new DynamoDB.DocumentClient();

export async function createKurral( kurral: ThirukkuralEvaluation[]) {
 const start = new Date().getTime();
 try {
   if (await readAndDeleteKurral(kurral)) {
    for await (const persisted of mapper.batchPut(kurral)) {
     console.log(`event_type="API", action="KURRAL_CREATE",status="Success", promo_key="${persisted.id}",duration_millis="${new Date().getTime() - start}"`);
    }
    return success('{"kurallCreation": "success"}');
   } else {
     return error(400, "Internal Server Error.");
   }
 } catch (exception) {
     console.error(`Error creating/updating promo data to dynamodb - ${exception}`);
     console.log(`event_type="API", action="TIER_PROMO_CREATE",status="Failed", duration_millis="${new Date().getTime() - start}"`);
     throw exception;
 }
}

export async function readAndDeleteKurral(thirukkuralEvaluation: ThirukkuralEvaluation[]) {
 const start = new Date().getTime();
 let allTierQry = getAllKurral(thirukkuralEvaluation[0].id || '');
 let thrikurralList: ThirukkuralEvaluation[] = [];
 try {
     let kurralResults = await dynamoDb.query(allTierQry).promise();

     if (kurralResults && kurralResults.Items && kurralResults.Items.length) {
         kurralResults.Items.forEach((kurralItem: any) => {
           thrikurralList.push(populateThirukkuralEvaluationnModel(kurralItem));
         });
     }
     if (thrikurralList && thrikurralList.length) {
         for await (const persisted of mapper.batchDelete(thrikurralList)) {
             console.log(`event_type="API", action="THIRUKURRAL_DELETE",status="Success", kural_id="${persisted.id}",duration_millis="${new Date().getTime() - start}"`);
         }
     }
     return true;
 } catch (exception) {
     console.error(`Error deleting promo data in dynamodb - ${exception}`);
     console.log(`event_type="API", action="THIRUKURRAL_DELETE",status="Failed", duration_millis="${new Date().getTime() - start}"`);
     return false;
 }
}

function getAllKurral(id: string) {
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

@table(thirukurralTableName)
export class ThirukkuralEvaluation {
 @hashKey()
 id: string | undefined;
 @attribute()
 Line1: string | undefined;
 @attribute()
 Line2: string | undefined;
 @attribute()
 Translation: string | undefined;
 @attribute()
 mv: string | undefined;
 @attribute()
 sp: string | undefined;
 @attribute()
 mk: string | undefined;
 @attribute()
 explanation: string | undefined;
 @attribute()
 couplet: string | undefined;
 @attribute()
 transliteration1: string | undefined;
 @attribute()
 transliteration2: string | undefined;
 @attribute()
 paul_name: string | undefined;
 @attribute()
 paul_transliteration: string | undefined;
 @attribute()
 paul_translation: string | undefined;
 @attribute()
 iyal_name: string | undefined;
 @attribute()
 iyal_transliteration: string | undefined;
 @attribute()
 iyal_translation: string | undefined;
 @attribute()
 adikaram_name: string | undefined;
 @attribute()
 adikaram_transliteration: string | undefined;
 @attribute()
 adikaram_translation: string | undefined;
}

export function populateThirukkuralEvaluationnModel(kurralJson: any) {
    console.log(kurralJson.mv);
    
 let kurral = new ThirukkuralEvaluation();
 kurral.id = kurralJson.id;
 kurral.Line1 = kurralJson.line1;
 kurral.Line2 = kurralJson.line2;
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
 console.log(`Arun ${JSON.stringify(kurral)}`);
 
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