<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// === CONEXÃO COM O BANCO ===
$host = 'mysql.tendapromos.com.br';
$dbname = 'tendapromos01';
$user = 'tendapro01_add1';
$pass = '060610Ejcj1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na conexão: ' . $e->getMessage()]);
    exit;
}

// === RECEBER POST JSON ===
$data = json_decode(file_get_contents("php://input"), true);

$id_registro = isset($data['id_registro']) ? intval($data['id_registro']) : 0;
$id_usuario  = isset($data['id_usuario']) ? intval($data['id_usuario'])  : 0;

if ($id_registro <= 0 || $id_usuario <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do registro ou ID do usuário faltando.']);
    exit;
}

// === VERIFICAR SE O REGISTRO EXISTE ===
$check = $pdo->prepare("
    SELECT id 
    FROM empregos_anteriores 
    WHERE id = :id AND id_usuario = :id_usuario 
    LIMIT 1
");
$check->execute([
    ':id' => $id_registro,
    ':id_usuario' => $id_usuario
]);

if ($check->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Registro não encontrado para este usuário.']);
    exit;
}

// === DELETAR ===
$delete = $pdo->prepare("
    DELETE FROM empregos_anteriores 
    WHERE id = :id AND id_usuario = :id_usuario 
    LIMIT 1
");

$ok = $delete->execute([
    ':id' => $id_registro,
    ':id_usuario' => $id_usuario
]);

if ($ok) {
    echo json_encode(['sucesso' => true, 'mensagem' => 'Emprego anterior excluído com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao excluir o registro.']);
}
