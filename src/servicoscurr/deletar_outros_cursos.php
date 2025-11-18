<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// === CONFIGURAÇÃO DE BANCO ===
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

// === RECEBE DADOS JSON ===
$dados = json_decode(file_get_contents("php://input"), true);

if (
    !$dados ||
    empty($dados['id_usuario']) ||
    empty($dados['id_curso'])
) {
    http_response_code(400);
    echo json_encode([
        'erro' => 'Campos obrigatórios: id_usuario e id_curso.'
    ]);
    exit;
}

$id_usuario = intval($dados['id_usuario']);
$id_curso   = intval($dados['id_curso']);

// === VERIFICA SE O CURSO EXISTE E PERTENCE AO USUÁRIO ===
try {
    $stmt = $pdo->prepare("SELECT id FROM outros_cursos WHERE id = :id AND id_usuario = :id_usuario LIMIT 1");
    $stmt->execute([
        ':id' => $id_curso,
        ':id_usuario' => $id_usuario
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['erro' => 'Curso não encontrado ou não pertence ao usuário.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao verificar curso: ' . $e->getMessage()]);
    exit;
}

// === DELETAR CURSO ===
try {
    $stmt = $pdo->prepare("DELETE FROM outros_cursos WHERE id = :id AND id_usuario = :id_usuario");
    $stmt->execute([
        ':id' => $id_curso,
        ':id_usuario' => $id_usuario
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Curso deletado com sucesso.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao deletar curso: ' . $e->getMessage()]);
}
?>
