<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Falha na conexão'
    ]);
    exit;
}

// === CONSULTA USUÁRIOS ONLINE ===
// Considera online quem pingou nos últimos 2 minutos
$sql = "
    SELECT 
        id,
        nome,
        email,
        funcao,
        data_criacao,
        ultimo_ping
    FROM usuarios
    WHERE ultimo_ping >= (NOW() - INTERVAL 2 MINUTE)
    ORDER BY ultimo_ping DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'sucesso' => true,
    'total' => count($usuarios),
    'dados' => $usuarios
]);
