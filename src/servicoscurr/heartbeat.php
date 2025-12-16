<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

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
        'erro' => 'Falha na conexão: ' . $e->getMessage()
    ]);
    exit;
}

// === LE JSON ===
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$id_usuario = intval($data['id_usuario'] ?? 0);

if ($id_usuario <= 0) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'erro' => 'ID inválido'
    ]);
    exit;
}

// === UPDATE PING ===
$stmt = $pdo->prepare("
    UPDATE usuarios
    SET ultimo_ping = NOW()
    WHERE id = :id
");
$stmt->execute([':id' => $id_usuario]);

echo json_encode(['sucesso' => true]);
