<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

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

// === RECEBE JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['id_pos'])
) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetros obrigatórios: id_usuario e id_pos.']);
    exit;
}

$id_usuario = intval($dados['id_usuario']);
$id_pos = intval($dados['id_pos']);

// === VERIFICA SE O USUÁRIO EXISTE ===
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id_usuario]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Usuário não encontrado.']);
    exit;
}

// === VERIFICA SE O REGISTRO EXISTE E PERTENCE AO USUÁRIO ===
$stmt = $pdo->prepare("
    SELECT id FROM pos_graduacao 
    WHERE id = :id_pos AND id_usuario = :id_usuario
    LIMIT 1
");
$stmt->execute([
    ':id_pos' => $id_pos,
    ':id_usuario' => $id_usuario
]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['erro' => 'Registro não encontrado ou não pertence ao usuário.']);
    exit;
}

// === DELETAR REGISTRO ===
$stmt = $pdo->prepare("DELETE FROM pos_graduacao WHERE id = :id_pos LIMIT 1");

if ($stmt->execute([':id_pos' => $id_pos])) {
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Registro de pós-graduação removido com sucesso.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha ao deletar registro.']);
}
?>
