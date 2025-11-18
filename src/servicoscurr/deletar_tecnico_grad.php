<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONEXÃO COM O BANCO ===
$host = 'mysql.tendappromos.com.br';
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

// === RECEBE OS DADOS JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados || empty($dados['id_usuario']) || empty($dados['id'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'id_usuario e id são obrigatórios.']);
    exit;
}

$id_usuario = intval($dados['id_usuario']);
$id         = intval($dados['id']);

// === VERIFICAR SE O USUÁRIO EXISTE ===
try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id_usuario]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Usuário não encontrado.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar usuário: ' . $e->getMessage()]);
    exit;
}

// === VERIFICAR SE O REGISTRO EXISTE ===
try {
    $stmt = $pdo->prepare("
        SELECT id 
        FROM ensino_tecnico_graduacao 
        WHERE id = :id AND id_usuario = :id_usuario
        LIMIT 1
    ");
    $stmt->execute([
        ':id' => $id,
        ':id_usuario' => $id_usuario
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Registro não encontrado para este usuário.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao localizar registro: ' . $e->getMessage()]);
    exit;
}

// === EXCLUIR REGISTRO ===
try {
    $stmt = $pdo->prepare("
        DELETE FROM ensino_tecnico_graduacao 
        WHERE id = :id AND id_usuario = :id_usuario
    ");

    $ok = $stmt->execute([
        ':id' => $id,
        ':id_usuario' => $id_usuario
    ]);

    if ($ok) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Registro excluído com sucesso!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Falha ao excluir o registro.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao excluir registro: ' . $e->getMessage()]);
}
?>
