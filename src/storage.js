"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var aws_sdk_1 = require("aws-sdk");
var dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
var dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
exports.thirukurralTableName = process.env['THIRUKKURAL_TABLE_NAME'] || '';
var mapper = new dynamodb_data_mapper_1.DataMapper({ client: new aws_sdk_1.DynamoDB() });
var dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
function createKurral(kurral) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var start, _b, _c, persisted, e_1_1, exception_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    start = new Date().getTime();
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 17, , 18]);
                    return [4 /*yield*/, readAndDeleteKurral(kurral)];
                case 2:
                    if (!_d.sent()) return [3 /*break*/, 15];
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 8, 9, 14]);
                    _b = __asyncValues(mapper.batchPut(kurral));
                    _d.label = 4;
                case 4: return [4 /*yield*/, _b.next()];
                case 5:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 7];
                    persisted = _c.value;
                    console.log("event_type=\"API\", action=\"KURRAL_CREATE\",status=\"Success\", promo_key=\"" + persisted.id + "\",duration_millis=\"" + (new Date().getTime() - start) + "\"");
                    _d.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _d.trys.push([9, , 12, 13]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(_b)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/, success('{"kurallCreation": "success"}')];
                case 15: return [2 /*return*/, error(400, "Internal Server Error.")];
                case 16: return [3 /*break*/, 18];
                case 17:
                    exception_1 = _d.sent();
                    console.error("Error creating/updating promo data to dynamodb - " + exception_1);
                    console.log("event_type=\"API\", action=\"TIER_PROMO_CREATE\",status=\"Failed\", duration_millis=\"" + (new Date().getTime() - start) + "\"");
                    throw exception_1;
                case 18: return [2 /*return*/];
            }
        });
    });
}
exports.createKurral = createKurral;
function readAndDeleteKurral(thirukkuralEvaluation) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var start, allTierQry, thrikurralList, kurralResults, _b, _c, persisted, e_2_1, exception_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    start = new Date().getTime();
                    allTierQry = getAllKurral(thirukkuralEvaluation[0].id || -1);
                    thrikurralList = [];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, dynamoDb.query(allTierQry).promise()];
                case 2:
                    kurralResults = _d.sent();
                    if (kurralResults && kurralResults.Items && kurralResults.Items.length) {
                        kurralResults.Items.forEach(function (kurralItem) {
                            thrikurralList.push(populateThirukkuralEvaluationnModel(kurralItem));
                        });
                    }
                    if (!(thrikurralList && thrikurralList.length)) return [3 /*break*/, 14];
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 8, 9, 14]);
                    _b = __asyncValues(mapper.batchDelete(thrikurralList));
                    _d.label = 4;
                case 4: return [4 /*yield*/, _b.next()];
                case 5:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 7];
                    persisted = _c.value;
                    console.log("event_type=\"API\", action=\"THIRUKURRAL_DELETE\",status=\"Success\", kural_id=\"" + persisted.id + "\",duration_millis=\"" + (new Date().getTime() - start) + "\"");
                    _d.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _d.trys.push([9, , 12, 13]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(_b)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/, true];
                case 15:
                    exception_2 = _d.sent();
                    console.error("Error deleting promo data in dynamodb - " + exception_2);
                    console.log("event_type=\"API\", action=\"THIRUKURRAL_DELETE\",status=\"Failed\", duration_millis=\"" + (new Date().getTime() - start) + "\"");
                    return [2 /*return*/, false];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.readAndDeleteKurral = readAndDeleteKurral;
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
var ThirukkuralEvaluation = /** @class */ (function () {
    function ThirukkuralEvaluation() {
    }
    __decorate([
        dynamodb_data_mapper_annotations_1.hashKey(),
        __metadata("design:type", Number)
    ], ThirukkuralEvaluation.prototype, "id");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "Line1");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "Line2");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "Translation");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "mv");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "sp");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "mk");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "explanation");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "couplet");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "transliteration1");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "transliteration2");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "paul_name");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "paul_transliteration");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "paul_translation");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "iyal_name");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "iyal_transliteration");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "iyal_translation");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "adikaram_name");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "adikaram_transliteration");
    __decorate([
        dynamodb_data_mapper_annotations_1.attribute(),
        __metadata("design:type", String)
    ], ThirukkuralEvaluation.prototype, "adikaram_translation");
    ThirukkuralEvaluation = __decorate([
        dynamodb_data_mapper_annotations_1.table(exports.thirukurralTableName)
    ], ThirukkuralEvaluation);
    return ThirukkuralEvaluation;
}());
exports.ThirukkuralEvaluation = ThirukkuralEvaluation;
function populateThirukkuralEvaluationnModel(kurralJson) {
    console.log(kurralJson.mv);
    var kurral = new ThirukkuralEvaluation();
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
    kurral.transliteration1 = kurralJson.transliteration1;
    kurral.transliteration2 = kurralJson.transliteration2;
    kurral.paul_name = kurralJson.paul_name;
    kurral.paul_transliteration = kurralJson.paul_transliteration;
    kurral.paul_translation = kurralJson.paul_translation;
    kurral.iyal_name = kurralJson.iyal_name;
    kurral.iyal_transliteration = kurralJson.iyal_transliteration;
    kurral.iyal_translation = kurralJson.iyal_translation;
    kurral.adikaram_name = kurralJson.adikaram_name;
    kurral.adikaram_transliteration = kurralJson.adikaram_transliteration;
    kurral.adikaram_translation = kurralJson.adikaram_translation;
    console.log("Arun " + JSON.stringify(kurral));
    return kurral;
}
exports.populateThirukkuralEvaluationnModel = populateThirukkuralEvaluationnModel;
function success(payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: payload
                }];
        });
    });
}
exports.success = success;
function error(statusCode, errorText) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    statusCode: statusCode,
                    body: errorText
                }];
        });
    });
}
exports.error = error;
//# sourceMappingURL=storage.js.map