var crypto = require("crypto");
// 字串組合
function genDataChain(order) {
  const { MERCHANTID, RESPONDTYPE, VERSION } = process.env;
  return `MerchantID=${MERCHANTID}&RespondType=${RESPONDTYPE}&TimeStamp=${
    order.TimeStamp
  }&Version=${VERSION}&MerchantOrderNo=${order.MerchantOrderNo}&Amt=${
    order.Amt
  }&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${encodeURIComponent(
    order.Email,
  )}`;
}
// 對應文件 P16：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
function create_mpg_aes_encrypt(TradeInfo) {
  const { HASHKEY, HASHIV } = process.env;
  const encrypt = crypto.createCipheriv("aes256", HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

// 對應文件 P17：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HASHIV=".$iv;
function create_mpg_sha_encrypt(aesEncrypt) {
  const { HASHKEY, HASHIV } = process.env;
  const sha = crypto.createHash("sha256");
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;
  return sha.update(plainText).digest("hex").toUpperCase();
}

// 將 aes 解密
function create_mpg_aes_decrypt(TradeInfo) {
  const { HASHKEY, HASHIV } = process.env;
  const decrypt = crypto.createDecipheriv("aes256", HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, "hex", "utf8");
  const plainText = text + decrypt.final("utf8");
  const result = plainText.replace(/[\x00-\x20]+/g, "");
  return JSON.parse(result);
}

module.exports = {
  genDataChain,
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt
};