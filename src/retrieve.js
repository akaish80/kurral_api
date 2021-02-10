"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getKurralListByAdikarm = exports.getAllAdikaramJSON = exports.getKurralJSON = exports.adikaramTableName = exports.thirukurralTableName = void 0;
var aws_sdk_1 = require("aws-sdk");
var storage_1 = require("./storage");
exports.thirukurralTableName = process.env['THIRUKKURAL_TABLE_NAME'] || '';
exports.adikaramTableName = process.env['ADIKARAM_TABLE_NAME'] || '';
var dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
function getKurralJSON(kurralId) {
    return __awaiter(this, void 0, void 0, function () {
        var kurral;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getKurralByID(kurralId)];
                case 1:
                    kurral = _a.sent();
                    if (kurral) {
                        return [2 /*return*/, storage_1.success(JSON.stringify(kurral))];
                    }
                    console.error('No Kurral By ID Data found');
                    return [2 /*return*/, storage_1.success('{}')];
            }
        });
    });
}
exports.getKurralJSON = getKurralJSON;
var getSortedList = function (Items) {
    return Items.sort(function (a, b) {
        return +a.id - +b.id;
    });
};
function getAllAdikaramJSON() {
    return __awaiter(this, void 0, void 0, function () {
        var kurralResults, kurralItem, sortedItems, Items, exception_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dynamoDb.scan({
                            TableName: exports.adikaramTableName
                        }).promise()];
                case 1:
                    kurralResults = _a.sent();
                    kurralItem = kurralResults && kurralResults.Items;
                    sortedItems = void 0;
                    if (kurralItem) {
                        Items = kurralResults.Items;
                        sortedItems = getSortedList(Items);
                    }
                    if (sortedItems.length > 0) {
                        return [2 /*return*/, storage_1.success(JSON.stringify(sortedItems))];
                    }
                    console.error('No Kurral By ID Data found');
                    return [2 /*return*/, storage_1.success('{}')];
                case 2:
                    exception_1 = _a.sent();
                    console.error("Error fetching kurral adikaram from dynamodb - " + exception_1);
                    return [2 /*return*/, storage_1.success('{}')];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllAdikaramJSON = getAllAdikaramJSON;
var scanAll = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var all, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                all = [];
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        dynamoDb.scan(params, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            case 2:
                data = _a.sent();
                all = all.concat(data.Items);
                if (data.LastEvaluatedKey)
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                else
                    return [3 /*break*/, 3];
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, all];
        }
    });
}); };
function getKurralListByAdikarm(beginIndex, endIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var getKurralQueryForScan, kurralItemList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getKurralQueryForScan = getKurral(beginIndex, endIndex);
                    return [4 /*yield*/, scanAll(getKurralQueryForScan)["catch"](function (err) {
                            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                            // return success('{}');
                        })
                            .then(function (records) {
                            return getSortedList(records);
                        })];
                case 1:
                    kurralItemList = _a.sent();
                    if (kurralItemList.length > 0) {
                        return [2 /*return*/, storage_1.success(JSON.stringify(kurralItemList))];
                    }
                    else {
                        console.error('No Kurral By ID Data found');
                        return [2 /*return*/, storage_1.success('{}')];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getKurralListByAdikarm = getKurralListByAdikarm;
function getKurralByID(id) {
    return __awaiter(this, void 0, void 0, function () {
        var kurral, getKurralQuery, kurralResults, kurralItem, exception_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getKurralQuery = getAllKurral(id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dynamoDb.query(getKurralQuery).promise()];
                case 2:
                    kurralResults = _a.sent();
                    kurralItem = kurralResults && kurralResults.Items && kurralResults.Items[0];
                    if (kurralItem) {
                        kurral = storage_1.populateThirukkuralEvaluationnModel(kurralItem);
                    }
                    return [2 /*return*/, kurral];
                case 3:
                    exception_2 = _a.sent();
                    console.error("Error fetching kurral from dynamodb - " + exception_2);
                    return [2 /*return*/, kurral];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAllKurral(id) {
    return {
        TableName: exports.thirukurralTableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": id
        }
    };
}
function getKurral(beginIndex, endIndex) {
    return {
        TableName: exports.thirukurralTableName,
        FilterExpression: 'id BETWEEN :beginIndex AND :endIndex',
        ExpressionAttributeValues: {
            ":beginIndex": beginIndex,
            ":endIndex": endIndex
        },
        Limit: 500
    };
}
//# sourceMappingURL=retrieve.js.map