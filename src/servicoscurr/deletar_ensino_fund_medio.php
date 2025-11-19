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

// === LER JSON ===
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['erro' => 'Corpo da requisição inválido.']);
    exit;
}

$id_usuario = $input['id_usuario'] ?? null;
$id_registro = $input['id_registro'] ?? null;

if (!$id_usuario || !$id_registro) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetros obrigatórios: id_usuario e id_registro.']);
    exit;
}

// === VALIDAR SE O USUÁRIO EXISTE ===
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
    echo json_encode(['erro' => 'Erro ao consultar usuário: ' . $e->getMessage()]);
    exit;
}

// === DELETAR REGISTRO ===
try {
    $sql = "DELETE FROM ensino_fundamental_medio WHERE id = :id_registro AND id_usuario = :id_usuario";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id_registro' => $id_registro,
        ':id_usuario' => $id_usuario
    ]);

    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Registro não encontrado ou já removido.'
        ]);
        exit;
    }

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Registro excluído com sucesso.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao excluir: ' . $e->getMessage()]);
}
?>
