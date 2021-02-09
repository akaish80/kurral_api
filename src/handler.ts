import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createKurral, ThirukkuralEvaluation, populateThirukkuralEvaluationnModel, error } from './storage';
import { getKurralJSON, getAllAdikaramJSON, getKurralListByAdikarm } from './retrieve';

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const kurralJson = event.body ? JSON.parse(event.body.toString()) : undefined;
  let thrikurralList: ThirukkuralEvaluation [] = [];

  if (kurralJson && kurralJson && kurralJson.length) {
    kurralJson.forEach((kurral: any) => {
     thrikurralList.push(populateThirukkuralEvaluationnModel(kurral));
    });
    if (thrikurralList && thrikurralList.length) {
      return createKurral(thrikurralList);
    } else {
      return error(400, "Invalid Request. KurralCreation request is empty");
    }
  } else {
   console.log('event_type="API, action="THIRUKURRAL_CREATE","status="FAILED", "msg"= KurralCreation Request with no JSON."');
   return error(400, "Invalid Request. KurralCreation request is empty");
  }
}

export async function getKurral(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  const kurralJson:number = event.queryStringParameters ? Number(event.queryStringParameters.id) : -1;

  console.log(`event_type="API", action="THIRUKURRAL_READ","status="Failed","msg"=" Get Kurral with no JSON.${kurralJson}"`);
  if (kurralJson != -1) {
    return getKurralJSON(kurralJson);
  } else {
    console.log('event_type="API", action="THIRUKURRAL_READ","status="Failed","msg"=" Get Kurral with no JSON."');
    return error(400, "Invalid Request. Get Kurral request is empty");
  }
}

export async function getAllAdikaram(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  console.log(`event_type="API", action="THIRUKURRAL_READ","status="Success","msg"=" Get Kurral with no JSON."`);
  return getAllAdikaramJSON()
}

export async function getKurralBasedOnIndex(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const adikaram_name = event.queryStringParameters ? String(event.queryStringParameters.adikaram_name) : "";
  if (adikaram_name != ""){
    return getKurralListByAdikarm(adikaram_name);
  } else {

    console.log('event_type="API", action="THIRUKURRAL_READ","status="Failed","msg"=" Get Kurral with adikaram name"');
    return error(400, "Invalid Request. Get Kurral request is empty");
  }
}