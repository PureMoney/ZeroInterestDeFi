"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.__esModule = true;
exports.parsePriceData = exports.parseProductData = exports.parseMappingData = exports.getFeedData = exports.setFeedPrice = exports.createPriceFeed = exports.PriceType = exports.CorpAction = exports.PriceStatus = exports.Version = exports.Version1 = exports.Magic = void 0;
var buffer_1 = require("buffer");
var anchor_1 = require("@project-serum/anchor");
exports.Magic = 0xa1b2c3d4;
exports.Version1 = 1;
exports.Version = exports.Version1;
exports.PriceStatus = ['Unknown', 'Trading', 'Halted', 'Auction'];
exports.CorpAction = ['NoCorpAct'];
exports.PriceType = ['Unknown', 'Price', 'TWAP', 'Volatility'];
var empty32Buffer = buffer_1.Buffer.alloc(32);
var PKorNull = function (data) { return (data.equals(empty32Buffer) ? null : new anchor_1.web3.PublicKey(data)); };
exports.createPriceFeed = function (_a) {
    console.log('_a = ', _a);
    var oracleProgram = _a.oracleProgram, initPrice = _a.initPrice, confidence = _a.confidence, _b = _a.expo, expo = _b === void 0 ? -4 : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var conf, collateralTokenFeed, _c, _d, _e, _f, _g;
        var _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    conf = confidence || new anchor_1.BN((initPrice / 10) * Math.pow(10, -expo));
                    collateralTokenFeed = new anchor_1.web3.Account();
                    _d = (_c = oracleProgram.rpc).initialize;
                    _e = [new anchor_1.BN(initPrice * Math.pow(10, -expo)), expo, conf];
                    _h = {
                        accounts: { price: collateralTokenFeed.publicKey },
                        signers: [collateralTokenFeed]
                    };
                    _g = (_f = anchor_1.web3.SystemProgram).createAccount;
                    _j = {
                        fromPubkey: oracleProgram.provider.wallet.publicKey,
                        newAccountPubkey: collateralTokenFeed.publicKey,
                        space: 1712
                    };
                    return [4 /*yield*/, oracleProgram.provider.connection.getMinimumBalanceForRentExemption(1712)];
                case 1: return [4 /*yield*/, _d.apply(_c, _e.concat([(_h.instructions = [
                            _g.apply(_f, [(_j.lamports = _k.sent(),
                                    _j.programId = oracleProgram.programId,
                                    _j)])
                        ],
                            _h)]))];
                case 2:
                    _k.sent();
                    return [2 /*return*/, collateralTokenFeed.publicKey];
            }
        });
    });
};
exports.setFeedPrice = function (oracleProgram, newPrice, priceFeed) { return __awaiter(void 0, void 0, void 0, function () {
    var info, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, oracleProgram.provider.connection.getAccountInfo(priceFeed)];
            case 1:
                info = _a.sent();
                data = exports.parsePriceData(info.data);
                return [4 /*yield*/, oracleProgram.rpc.setPrice(new anchor_1.BN(newPrice * Math.pow(10, -data.exponent)), {
                        accounts: { price: priceFeed }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getFeedData = function (oracleProgram, priceFeed) { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, oracleProgram.provider.connection.getAccountInfo(priceFeed)];
            case 1:
                info = _a.sent();
                return [2 /*return*/, exports.parsePriceData(info.data)];
        }
    });
}); };
exports.parseMappingData = function (data) {
    // Pyth magic number.
    var magic = data.readUInt32LE(0);
    // Program version.
    var version = data.readUInt32LE(4);
    // Account type.
    var type = data.readUInt32LE(8);
    // Account used size.
    var size = data.readUInt32LE(12);
    // Number of product accounts.
    var numProducts = data.readUInt32LE(16);
    // Unused.
    // const unused = accountInfo.data.readUInt32LE(20)
    // TODO: check and use this.
    // Next mapping account (if any).
    var nextMappingAccount = PKorNull(data.slice(24, 56));
    // Read each symbol account.
    var offset = 56;
    var productAccountKeys = [];
    for (var i = 0; i < numProducts; i++) {
        var productAccountBytes = data.slice(offset, offset + 32);
        var productAccountKey = new anchor_1.web3.PublicKey(productAccountBytes);
        offset += 32;
        productAccountKeys.push(productAccountKey);
    }
    return {
        magic: magic,
        version: version,
        type: type,
        size: size,
        nextMappingAccount: nextMappingAccount,
        productAccountKeys: productAccountKeys
    };
};
exports.parseProductData = function (data) {
    // Pyth magic number.
    var magic = data.readUInt32LE(0);
    // Program version.
    var version = data.readUInt32LE(4);
    // Account type.
    var type = data.readUInt32LE(8);
    // Price account size.
    var size = data.readUInt32LE(12);
    // First price account in list.
    var priceAccountBytes = data.slice(16, 48);
    var priceAccountKey = new anchor_1.web3.PublicKey(priceAccountBytes);
    var product = {};
    var idx = 48;
    while (idx < data.length) {
        var keyLength = data[idx];
        idx++;
        if (keyLength) {
            var key = data.slice(idx, idx + keyLength).toString();
            idx += keyLength;
            var valueLength = data[idx];
            idx++;
            var value = data.slice(idx, idx + valueLength).toString();
            idx += valueLength;
            product[key] = value;
        }
    }
    return { magic: magic, version: version, type: type, size: size, priceAccountKey: priceAccountKey, product: product };
};
var parsePriceInfo = function (data, exponent) {
    // Aggregate price.
    var priceComponent = data.readBigUInt64LE(0);
    var price = Number(priceComponent) * Math.pow(10, exponent);
    // Aggregate confidence.
    var confidenceComponent = data.readBigUInt64LE(8);
    var confidence = Number(confidenceComponent) * Math.pow(10, exponent);
    // Aggregate status.
    var status = data.readUInt32LE(16);
    // Aggregate corporate action.
    var corporateAction = data.readUInt32LE(20);
    // Aggregate publish slot.
    var publishSlot = data.readBigUInt64LE(24);
    return {
        priceComponent: priceComponent,
        price: price,
        confidenceComponent: confidenceComponent,
        confidence: confidence,
        status: status,
        corporateAction: corporateAction,
        publishSlot: publishSlot
    };
};
exports.parsePriceData = function (data) {
    // Pyth magic number.
    var magic = data.readUInt32LE(0);
    // Program version.
    var version = data.readUInt32LE(4);
    // Account type.
    var type = data.readUInt32LE(8);
    // Price account size.
    var size = data.readUInt32LE(12);
    // Price or calculation type.
    var priceType = data.readUInt32LE(16);
    // Price exponent.
    var exponent = data.readInt32LE(20);
    // Number of component prices.
    var numComponentPrices = data.readUInt32LE(24);
    // Unused.
    // const unused = accountInfo.data.readUInt32LE(28)
    // Currently accumulating price slot.
    var currentSlot = data.readBigUInt64LE(32);
    // Valid on-chain slot of aggregate price.
    var validSlot = data.readBigUInt64LE(40);
    // Product id / reference account.
    var productAccountKey = new anchor_1.web3.PublicKey(data.slice(48, 80));
    // Next price account in list.
    var nextPriceAccountKey = new anchor_1.web3.PublicKey(data.slice(80, 112));
    // Aggregate price updater.
    var aggregatePriceUpdaterAccountKey = new anchor_1.web3.PublicKey(data.slice(112, 144));
    var aggregatePriceInfo = parsePriceInfo(data.slice(144, 176), exponent);
    // Urice components - up to 16.
    var priceComponents = [];
    var offset = 176;
    var shouldContinue = true;
    while (offset < data.length && shouldContinue) {
        var publisher = PKorNull(data.slice(offset, offset + 32));
        offset += 32;
        if (publisher) {
            var aggregate = parsePriceInfo(data.slice(offset, offset + 32), exponent);
            offset += 32;
            var latest = parsePriceInfo(data.slice(offset, offset + 32), exponent);
            offset += 32;
            priceComponents.push({ publisher: publisher, aggregate: aggregate, latest: latest });
        }
        else {
            shouldContinue = false;
        }
    }
    return __assign(__assign({ magic: magic,
        version: version,
        type: type,
        size: size,
        priceType: priceType,
        exponent: exponent,
        numComponentPrices: numComponentPrices,
        currentSlot: currentSlot,
        validSlot: validSlot,
        productAccountKey: productAccountKey,
        nextPriceAccountKey: nextPriceAccountKey,
        aggregatePriceUpdaterAccountKey: aggregatePriceUpdaterAccountKey }, aggregatePriceInfo), { priceComponents: priceComponents });
};
