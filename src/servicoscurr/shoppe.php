<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$appId     = '18371110731';
$appSecret = 'DXM2LTENLAIMTLKTRMNBDSROAF2BHNAY';
$endpoint  = 'https://open-api.affiliate.shopee.com.br/graphql';

$input = json_decode(file_get_contents('php://input'), true);
$scrollId = $input['scrollId'] ?? null;

function buildQuery(?string $scrollId = null): string
{
    if (!$scrollId) {
        return '{productOfferV2(){nodes{productName itemId commissionRate commission price sales imageUrl shopName productLink offerLink periodStartTime periodEndTime priceMin priceMax productCatIds ratingStar priceDiscountRate shopId shopType sellerCommissionRate shopeeCommissionRate}pageInfo{page limit hasNextPage scrollId}}}';
    }

    return '{productOfferV2(scrollId:"' . $scrollId . '"){nodes{productName itemId commissionRate commission price sales imageUrl shopName productLink offerLink periodStartTime periodEndTime priceMin priceMax productCatIds ratingStar priceDiscountRate shopId shopType sellerCommissionRate shopeeCommissionRate}pageInfo{page limit hasNextPage scrollId}}}';
}

// ===============================
// 1) QUERY
// ===============================
$query = buildQuery($scrollId);

// ===============================
// 2) PAYLOAD (JSON)
// ===============================
$payload = json_encode(
    ['query' => $query],
    JSON_UNESCAPED_SLASHES
);

// ===============================
// 3) SIGNATURE (OFICIAL)
// Signature = SHA256(Credential + Timestamp + Payload + Secret)
// ===============================
$timestamp  = time();
$baseString = $appId . $timestamp . $payload . $appSecret;
$signature  = hash('sha256', $baseString);

// ===============================
// 4) HEADERS
// ===============================
$headers = [
    'Content-Type: application/json',
    'Authorization: SHA256 Credential=' . $appId .
    ', Timestamp=' . $timestamp .
    ', Signature=' . $signature
];

// ===============================
// 5) CURL
// ===============================
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_TIMEOUT        => 30
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
